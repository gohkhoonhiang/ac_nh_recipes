var sortList = function(list, sort_key) {
  return list.sort(function(a, b) {
    if (a[sort_key] < b[sort_key]) {
      return -1;
    } else if (a[sort_key] > b[sort_key]) {
      return 1;
    } else {
      return 0;
    }
  });
};

var filterList = function(data, filter_options) {
  return data.filter(function(row) {
    return filter_options.reduce(function(condition, filter_option) {
      var filter_key = filter_option.key;
      var filter_val = filter_option.val;
      var filter_type = filter_option.type;
      if (filter_type === 'multiple') {
        condition = condition && (!filter_val || filter_val.length === 0 || filter_val.includes(row[filter_key]));
      } else {
        condition = condition && (!filter_val || row[filter_key] === filter_val);
      }
      return condition;
    }, true);
  });
};

var distinctMaterials = function(data) {
  var all_materials = data.reduce(function(acc, e) {
    var materials = e.materials_needed.map(m => m.item).filter(m => m.length > 0);
    return acc.concat(materials);
  }, []);
  return Array.from(new Set(all_materials));
};

var distinctList = function(data) {
  return Array.from(new Set(data)).sort();
};

var app = new Vue({
  el: '#app',
  vuetify: new Vuetify({
    theme: {
      themes: {
        light: {
          primary: '#0ab5cd',
          secondary: '#fffae5',
          header: '#686868',
          toolbar: '#f5f8fe',
          font: '#837865',
          error: '#e76e60',
        },
      },
    },
  }),

  created() {
    this.retrieveSettings();
    this.getEquipmentRecipeData();
    this.getHousewaresRecipeData();
    this.getMiscRecipeData();
    this.getOtherRecipeData();
    this.getToolsRecipeData();
    this.getWallMountedRecipeData();
    this.getWallpaperRugFlooringRecipeData();
  },

  data: {
    tab: null,

    recipe_search: '',
    materials_search: [],
    recipe_materials: [],

    equipment_recipe_data: [],
    filtered_equipment_recipe_data: [],
    equipment_row_expanded: [],
    equipment_row_single_expand: true,

    housewares_recipe_data: [],
    filtered_housewares_recipe_data: [],
    housewares_row_expanded: [],
    housewares_row_single_expand: true,

    misc_recipe_data: [],
    filtered_misc_recipe_data: [],
    misc_row_expanded: [],
    misc_row_single_expand: true,

    other_recipe_data: [],
    filtered_other_recipe_data: [],
    other_row_expanded: [],
    other_row_single_expand: true,

    tools_recipe_data: [],
    filtered_tools_recipe_data: [],
    tools_row_expanded: [],
    tools_row_single_expand: true,

    wall_mounted_recipe_data: [],
    filtered_wall_mounted_recipe_data: [],
    wall_mounted_row_expanded: [],
    wall_mounted_row_single_expand: true,

    wallpaper_rug_flooring_recipe_data: [],
    filtered_wallpaper_rug_flooring_recipe_data: [],
    wallpaper_rug_flooring_row_expanded: [],
    wallpaper_rug_flooring_row_single_expand: true,

    combined_recipe_data: [],
    filtered_combined_recipe_data: [],
    combined_row_expanded: [],
    combined_row_single_expand: true,

    recipe_headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: true,
        filterable: true,
        value: 'recipe_name',
      },
      { text: 'Materials', filterable: false, value: 'materials_needed' },
      { text: 'Size', filterable: false, value: 'size' },
      { text: 'Sell Price', filterable: false, value: 'sell_price' },
      { text: 'Actions', filterable: false, value: 'actions' },
    ],

    combined_recipe_headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: true,
        filterable: true,
        value: 'recipe_name',
      },
      { text: 'Type', filterable: false, value: 'type' },
      { text: 'Materials', filterable: false, value: 'materials_needed' },
      { text: 'Size', filterable: false, value: 'size' },
      { text: 'Sell Price', filterable: false, value: 'sell_price' },
      { text: 'Actions', filterable: false, value: 'actions' },
    ],

  },

  methods: {
    getEquipmentRecipeData: function() {
      var vm = this;
      $.ajax({
        url: 'https://raw.githubusercontent.com/rebekahgkh/ac_nh_recipes/master/data/ac_diy_equipment.json',
        method: 'GET'
      }).then(function (data) {
        var recipe_data = JSON.parse(data).data;
        var formatted_data = recipe_data.map(function(row) {
          var updated_row = row;
          updated_row['type'] = 'equipment';
          return updated_row;
        });

        vm.equipment_recipe_data = formatted_data;
        vm.combined_recipe_data = vm.combined_recipe_data.concat(vm.equipment_recipe_data);

        var equipment_materials = distinctMaterials(formatted_data);
        vm.recipe_materials = distinctList(equipment_materials.concat(vm.recipe_materials));
      });
    },

    getHousewaresRecipeData: function() {
      var vm = this;
      $.ajax({
        url: 'https://raw.githubusercontent.com/rebekahgkh/ac_nh_recipes/master/data/ac_diy_housewares.json',
        method: 'GET'
      }).then(function (data) {
        var recipe_data = JSON.parse(data).data;
        var formatted_data = recipe_data.map(function(row) {
          var updated_row = row;
          updated_row['type'] = 'housewares';
          return updated_row;
        });

        vm.housewares_recipe_data = formatted_data;
        vm.combined_recipe_data = vm.combined_recipe_data.concat(vm.housewares_recipe_data);

        var housewares_materials = distinctMaterials(formatted_data);
        vm.recipe_materials = distinctList(housewares_materials.concat(vm.recipe_materials));
      });
    },

    getMiscRecipeData: function() {
      var vm = this;
      $.ajax({
        url: 'https://raw.githubusercontent.com/rebekahgkh/ac_nh_recipes/master/data/ac_diy_misc.json',
        method: 'GET'
      }).then(function (data) {
        var recipe_data = JSON.parse(data).data;
        var formatted_data = recipe_data.map(function(row) {
          var updated_row = row;
          updated_row['type'] = 'misc';
          return updated_row;
        });

        vm.misc_recipe_data = formatted_data;
        vm.combined_recipe_data = vm.combined_recipe_data.concat(vm.misc_recipe_data);

        var misc_materials = distinctMaterials(formatted_data);
        vm.recipe_materials = distinctList(misc_materials.concat(vm.recipe_materials));
      });
    },

    getOtherRecipeData: function() {
      var vm = this;
      $.ajax({
        url: 'https://raw.githubusercontent.com/rebekahgkh/ac_nh_recipes/master/data/ac_diy_other.json',
        method: 'GET'
      }).then(function (data) {
        var recipe_data = JSON.parse(data).data;
        var formatted_data = recipe_data.map(function(row) {
          var updated_row = row;
          updated_row['type'] = 'other';
          return updated_row;
        });

        vm.other_recipe_data = formatted_data;
        vm.combined_recipe_data = vm.combined_recipe_data.concat(vm.other_recipe_data);

        var other_materials = distinctMaterials(formatted_data);
        vm.recipe_materials = distinctList(other_materials.concat(vm.recipe_materials));
      });
    },

    getToolsRecipeData: function() {
      var vm = this;
      $.ajax({
        url: 'https://raw.githubusercontent.com/rebekahgkh/ac_nh_recipes/master/data/ac_diy_tools.json',
        method: 'GET'
      }).then(function (data) {
        var recipe_data = JSON.parse(data).data;
        var formatted_data = recipe_data.map(function(row) {
          var updated_row = row;
          updated_row['type'] = 'tools';
          return updated_row;
        });

        vm.tools_recipe_data = formatted_data;
        vm.combined_recipe_data = vm.combined_recipe_data.concat(vm.tools_recipe_data);

        var tools_materials = distinctMaterials(formatted_data);
        vm.recipe_materials = distinctList(tools_materials.concat(vm.recipe_materials));
      });
    },

    getWallMountedRecipeData: function() {
      var vm = this;
      $.ajax({
        url: 'https://raw.githubusercontent.com/rebekahgkh/ac_nh_recipes/master/data/ac_diy_wall_mounted.json',
        method: 'GET'
      }).then(function (data) {
        var recipe_data = JSON.parse(data).data;
        var formatted_data = recipe_data.map(function(row) {
          var updated_row = row;
          updated_row['type'] = 'wall_mounted';
          return updated_row;
        });

        vm.wall_mounted_recipe_data = formatted_data;
        vm.combined_recipe_data = vm.combined_recipe_data.concat(vm.wall_mounted_recipe_data);

        var wall_mounted_materials = distinctMaterials(formatted_data);
        vm.recipe_materials = distinctList(wall_mounted_materials.concat(vm.recipe_materials));
      });
    },

    getWallpaperRugFlooringRecipeData: function() {
      var vm = this;
      $.ajax({
        url: 'https://raw.githubusercontent.com/rebekahgkh/ac_nh_recipes/master/data/ac_diy_wallpaper_rug_flooring.json',
        method: 'GET'
      }).then(function (data) {
        var recipe_data = JSON.parse(data).data;
        var formatted_data = recipe_data.map(function(row) {
          var updated_row = row;
          updated_row['type'] = 'wallpaper_rug_flooring';
          return updated_row;
        });

        vm.wallpaper_rug_flooring_recipe_data = formatted_data;
        vm.combined_recipe_data = vm.combined_recipe_data.concat(vm.wallpaper_rug_flooring_recipe_data);

        var wallpaper_rug_flooring_materials = distinctMaterials(formatted_data);
        vm.recipe_materials = distinctList(wallpaper_rug_flooring_materials.concat(vm.recipe_materials));
      });
    },

    filterByMaterials: function(data) {
      var vm = this;
      var search = vm.materials_search;
      if (search.length === 0) { return data; }

      return data.filter(function(recipe) {
        var needed = recipe.materials_needed.map(m => m.item);
        return search.every(s => needed.includes(s));
      });
    },

    filterComplete: function(data) {
      var vm = this;
      var filters = [
      ];
      var filtered_by_materials = vm.filterByMaterials(data);
      return filterList(filtered_by_materials, filters);
    },

    filterEquipmentRecipeData: function() {
      var vm = this;
      vm.filtered_equipment_recipe_data = vm.filterComplete(vm.equipment_recipe_data);
    },

    filterHousewaresRecipeData: function() {
      var vm = this;
      vm.filtered_housewares_recipe_data = vm.filterComplete(vm.housewares_recipe_data);
    },

    filterMiscRecipeData: function() {
      var vm = this;
      vm.filtered_misc_recipe_data = vm.filterComplete(vm.misc_recipe_data);
    },

    filterOtherRecipeData: function() {
      var vm = this;
      vm.filtered_other_recipe_data = vm.filterComplete(vm.other_recipe_data);
    },

    filterToolsRecipeData: function() {
      var vm = this;
      vm.filtered_tools_recipe_data = vm.filterComplete(vm.tools_recipe_data);
    },

    filterWallMountedRecipeData: function() {
      var vm = this;
      vm.filtered_wall_mounted_recipe_data = vm.filterComplete(vm.wall_mounted_recipe_data);
    },

    filterWallpaperRugFlooringRecipeData: function() {
      var vm = this;
      vm.filtered_wallpaper_rug_flooring_recipe_data = vm.filterComplete(vm.wallpaper_rug_flooring_recipe_data);
    },

    filterCombinedRecipeData: function() {
      var vm = this;
      vm.filtered_combined_recipe_data = vm.filterComplete(vm.combined_recipe_data);
    },

    clearAllRecipeFilters: function() {
      var vm = this;
      vm.recipe_search = '';
    },

    retrieveSettings: function() {
      var vm = this;
      var settings = JSON.parse(localStorage.getItem('ac_nh_recipes_settings'));
      if (!settings) { return; }

      for (var property in settings) {
        vm[property] = settings[property];
      }
    },

    storeSettings: function() {
      var vm = this;
      var settings = {
      };

      localStorage.setItem('ac_nh_recipes_settings', JSON.stringify(settings));
    },

    resetSettings: function() {
      localStorage.removeItem('ac_nh_recipes_settings');
    },

  },

  watch: {
    equipment_recipe_data: function(new_val, old_val) {
      var vm = this;
      if (new_val.length > 0) {
        vm.filterEquipmentRecipeData();
      }
    },

    housewares_recipe_data: function(new_val, old_val) {
      var vm = this;
      if (new_val.length > 0) {
        vm.filterHousewaresRecipeData();
      }
    },

    misc_recipe_data: function(new_val, old_val) {
      var vm = this;
      if (new_val.length > 0) {
        vm.filterMiscRecipeData();
      }
    },

    other_recipe_data: function(new_val, old_val) {
      var vm = this;
      if (new_val.length > 0) {
        vm.filterOtherRecipeData();
      }
    },

    tools_recipe_data: function(new_val, old_val) {
      var vm = this;
      if (new_val.length > 0) {
        vm.filterToolsRecipeData();
      }
    },

    wall_mounted_recipe_data: function(new_val, old_val) {
      var vm = this;
      if (new_val.length > 0) {
        vm.filterWallMountedRecipeData();
      }
    },

    wallpaper_rug_flooring_recipe_data: function(new_val, old_val) {
      var vm = this;
      if (new_val.length > 0) {
        vm.filterWallpaperRugFlooringRecipeData();
      }
    },

    combined_recipe_data: function(new_val, old_val) {
      var vm = this;
      if (new_val.length > 0) {
        vm.filterCombinedRecipeData();
      }
    },

    materials_search: function(new_val, old_val) {
      var vm = this;
      vm.filterEquipmentRecipeData();
      vm.filterHousewaresRecipeData();
      vm.filterMiscRecipeData();
      vm.filterOtherRecipeData();
      vm.filterToolsRecipeData();
      vm.filterWallMountedRecipeData();
      vm.filterWallpaperRugFlooringRecipeData();
      vm.filterCombinedRecipeData();
    },

  },

  filters: {

  },
});
