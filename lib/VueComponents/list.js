'use babel';

import Vue from 'vue'

export default Vue.extend({
  name: 'list',
  props: ['item', 'list', 'index', 'selected', 'disable'],
  methods: {
    selectedEvent: function selectedEvent(item) {
      this.selected = item;
    }
  }
});
if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "<li v-dnd-draggable :dnd-draggable=item :dnd-index=index :dnd-disable-if=disable dnd-selected=selectedEvent v-bind:class=\"{'selected': selected === item, 'has-container': item.type === 'container'}\" :dnd-data=list><div class=\"epanel panel-vue padding\" v-if=\"item.type === 'container'\"><div class=panel-heading><h3 class=panel-title  title='{{item.id}}'>{{item.text}}</h3></div><div class=panel-body><ul v-dnd-list :dnd-list=item.columns :dnd-disable-if=disable :dnd-external-sources=true><list v-for=\"col in item.columns\" :item=col :list=item.columns :index=$index :selected.sync=selected :disable.sync=disable></list></ul></div></div><p v-else title='{{item.id}}'>{{item.text}}"
