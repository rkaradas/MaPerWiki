"use babel"
import Vue from 'vue'

export default Vue.extend({
    name: 'treeview-item',
    props: {
        toggleItem: Function,
        isFolderItem: Function,
        isRoot: Function,
        model: Object,
        expanded: Boolean,
        root: Boolean,
        firstChild: Boolean,
        lastChild: Boolean,
        folder: Boolean,
        level: Number
    }
});

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "<li :class=\"{\n        'bold': isFolderItem(model),\n        'expanded': model.expanded\n    }\"> <div> <slot name=indent></slot><span v-if=isFolderItem(model) class=\"arrow-{{model.expanded ? 'expanded' : 'collapsed'}}\" @click.stop=toggleItem(this.model)></span><span class=treeview-item-text data-marker-id={{model.markerId?model.markerId:''}} >{{model.name}}</span> </div> <slot name=child></slot>"
