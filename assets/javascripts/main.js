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

    equipment_recipe_data: [],
    filtered_equipment_recipe_data: [],

    housewares_recipe_data: [],
    filtered_housewares_recipe_data: [],

    misc_recipe_data: [],
    filtered_misc_recipe_data: [],

    other_recipe_data: [],
    filtered_other_recipe_data: [],

    tools_recipe_data: [],
    filtered_tools_recipe_data: [],

    wall_mounted_recipe_data: [],
    filtered_wall_mounted_recipe_data: [],

    wallpaper_rug_flooring_recipe_data: [],
    filtered_wallpaper_rug_flooring_recipe_data: [],

    combined_recipe_data: [],
    filtered_combined_recipe_data: [],

    recipe_headers: [
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
      { text: 'Obtained From', filterable: false, value: 'obtained_from' },
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
      });
    },

    filterComplete: function(data) {
      var vm = this;
      var filters = [
      ];
      return filterList(data, filters);
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

  },

  filters: {

  },
});
