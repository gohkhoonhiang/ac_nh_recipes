require 'rubygems'
require 'nokogiri'
require 'csv'
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
