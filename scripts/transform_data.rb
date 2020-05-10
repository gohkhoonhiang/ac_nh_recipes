require 'rubygems'
require 'nokogiri'
require 'csv'
require 'json'
require 'fileutils'

# References:
# HTML to CSV: https://gist.github.com/sandys/3910840
#
def convert_html_to_csv(input, output)
  pattern = /NH(?<width>[\d.]+)x(?<length>[\d.]+)sq/
  content = File.new(input, chomp: true)
  new_content = []
  while (line = content.gets)
    if pattern.match?(line)
      matcher = pattern.match(line)
      width, length = matcher["width"], matcher["length"]
      new_content << line.gsub(/\<a href=.*\>\<\/a\>/,"#{width}x#{length}").gsub("<br>", "\n")
    else
      new_content << line.gsub("<br>", "\n")
    end
  end

  tmpfile = "_#{File.basename(input, '.html')}.html"
  File.write(tmpfile, new_content.join("\n"))

  f = File.open(tmpfile)
  doc = Nokogiri::HTML(f)
  csv = CSV.open(output, 'w', col_sep: ",", quote_char: "'", force_quotes: true)

  # headers
  csv << ['Recipe Name', 'Image', 'Materials Needed', 'Size', 'Obtained From', 'Sell Price', 'Recipe Item']

  doc.xpath('//table/tbody/tr').each do |row|
    tarray = []
    row.xpath('td').each do |cell|
      tarray << cell.text.strip
    end
    tarray << 'false' if tarray.size == 6
    csv << tarray
  end

  csv.close

  FileUtils.rm(tmpfile)
end

# example
# Raw data:
# 'Recipe Name','Image','Materials Needed','Size','Obtained From','Sell Price','Recipe Item'
# 'Acorn pochette','','6x acorn','1.0x1.0','Balloon','2,400','false'
#
# will be converted to:
# Formatted data: {"recipe_name"=>"Acorn pochette", "materials_needed"=>"6x acorn", "size"=>"1.0x1.0", "obtained_from"=>"Balloon", "sell_price"=>"2,400", "recipe_item"=>false}
def format_data(input, output)
  raise InvalidFileFormat unless File.extname(input) == ".csv"

  content = CSV.read(input, col_sep: ",", quote_char: "'", headers: true)
  transformed = content.map do |row|
    row.to_h.transform_keys { |k| snake_case(k) }.transform_values { |v| normalize(v) }
  end

  formatted = format_rows(transformed)

  File.write(output, { data: formatted.sort_by { |row| row["recipe_name"] } }.to_json)
end

# example
# Raw data: {"recipe_name"=>"Acorn pochette", "materials_needed"=>"6x acorn", "size"=>"1.0x1.0", "obtained_from"=>"Balloon", "sell_price"=>"2,400", "recipe_item"=>false}
#
# will be converted to:
# Formatted data: {"recipe_name"=>"Acorn pochette", "materials_needed"=>[{"qty"=>6, "item"=>"acorn"}], "size"=>{"width"=>1, "length"=>1}, "obtained_from"=>"Balloon", "sell_price"=>2400, "recipe_item"=>false}
def format_rows(rows)
  rows = rows.reject { |row| row["recipe_name"].nil? || row["recipe_name"].empty? }
  rows.each do |row|
    format_row(row)
  end
  rows
end

def format_row(row)
  row["recipe_name"] = normalize_string(row["recipe_name"])
  row["materials_needed"] = normalize_materials(row["materials_needed"])
  row["size"] = normalize_size(row["size"])
  row["sell_price"] = normalize_price(row["sell_price"])
  row.delete("image")
end

def snake_case(s)
  s.downcase.tr(' ','_')
end

def normalize(s)
  return if s.nil?

  if s.match?(/TRUE/i)
    true
  elsif s.match?(/FALSE/i)
    false
  elsif integer?(s)
    s.to_i
  else
    s
  end
end

def integer?(s)
  Integer(s)
  true
rescue ArgumentError
  false
end

def normalize_materials(s)
  return [] if s.nil? || s.empty?

  materials = s.split("\n").reject { |m| m.strip.empty? }
  materials.map do |material|
    tokens = material.split(' ')
    qty = tokens.first.gsub('x', '').to_i
    item = tokens[1..-1].join(' ')
    { qty: qty, item: item }
  end
end

def normalize_size(s)
  return {} if s.nil?
  return {} unless s.match?(/\d\.\dx\d\.\d/)

  width, length = s.split('x')
  { width: width.to_f, length: length.to_f }
end

def normalize_price(s)
  return 0 if s.nil?
  return s if integer?(s)

  s.gsub(',', '').to_i
end

def normalize_string(s)
  return '' if s.empty?

  tokens = snake_case(s).split('_')
  tokens.first.capitalize!
  tokens.join(' ')
end
