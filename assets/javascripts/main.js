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
  },

  data: {
    tab: null,

    recipe_group_by_keys: [],
    recipe_group_by: null,

    recipe_search: '',

    equipment_recipe_data: [],
    filtered_equipment_recipe_data: [],

    housewares_recipe_data: [],
    filtered_housewares_recipe_data: [],

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
      { text: 'Obtained From', filterable: false, value: 'obtained_from' },
      { text: 'Sell Price', filterable: false, value: 'sell_price' },
      { text: 'Recipe Item', filterable: false, value: 'recipe_item' },
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
          return updated_row;
        });

        vm.equipment_recipe_data = formatted_data;
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
          return updated_row;
        });

        vm.housewares_recipe_data = formatted_data;
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
        recipe_group_by: vm.recipe_group_by,
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

    recipe_group_by: function(new_val, old_val) {
      var vm = this;
      vm.storeSettings();
    },

  },

  filters: {

  },
});
