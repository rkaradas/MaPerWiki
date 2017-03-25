'use babel';

import Vue from 'vue'

export default Vue.extend({
  name: 'list',
  props: ['item', 'list', 'index', 'selected', 'disable'],
  methods: {
    selectedEvent: function selectedEvent(item) {
      this.selected = item;
    },
    toggleList: function toggleList()
    {
    this.item.hideList = !this.item.hideList;
    }
  }
});
if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = `
<li v-dnd-draggable
  :dnd-draggable=item
  :dnd-index=index
  :dnd-disable-if=disable
  dnd-selected=selectedEvent
  v-bind:class=\"[item.type === 'container'?'list-nested-item':'list-item',{'selected': selected === item, 'collapsed': item.hideList}]\"
  :dnd-data=list>
    <template v-if="item.type === 'container'">
      <div title='{{item.id}}' class="list-item" v-on:click=toggleList>
        <span class='icon icon-file-directory'>{{item.text}}</span>
      </div>

      <ul v-dnd-list :dnd-list=item.columns
          :dnd-disable-if=disable :dnd-external-sources=true  v-bind:class=\"{'mpwHidden': item.hideList}\"

          class="list-tree">
        <list v-for=\"col in item.columns\" :item=col :list=item.columns :index=$index :selected.sync=selected :disable.sync=disable></list>
      </ul>
    </template>


      <span v-else class="icon icon-file-text"  title='{{item.id}}'>
      {{item.text}}
      </span>

</li>`
