"use babel"
/*
var __vueify_insert__ = require("vueify/lib/insert-css")
var __vueify_style__ = __vueify_insert__.insert(".treeview,.treeview ul{margin:0;padding:0;list-style:none}.treeview .indent{display:inline-block;width:30px}")
*/
import Vue from 'vue'
import TreeviewItem from './treeview-item'

export default Vue.extend({
    name: 'treeview',
    components: {TreeviewItem},
    props: {
        level: {
            type: Number,
            default: 0
        },
        model: Object,
        _model: Object,
        rootVisible: Boolean
    },
    beforeCompile: function () {
        if (this.rootVisible) {
            if (typeof this.model.expanded === 'undefined') {
                Vue.set(this.model, 'expanded', true);
            }
            this._model = {children: [this.model]};
        } else {
            this._model = this.model;
        }

        if (this._model.children) {
            this._model.children.forEach(function (child) {
                if (typeof child.expanded === 'undefined') {
                    Vue.set(child, 'expanded', false);
                }
            });
        }
    },
    methods: {
        reInit(){
            if (this.rootVisible) {
                if (typeof this.model.expanded === 'undefined') {
                    Vue.set(this.model, 'expanded', true);
                }
                this._model = {children: [this.model]};
            } else {
                this._model = this.model;
            }

            if (this._model.children) {
                this._model.children.forEach(function (child) {
                    if (typeof child.expanded === 'undefined') {
                        Vue.set(child, 'expanded', false);
                    }
                });
            }

        },
        isRoot (level) {
            return level === 0;
        },

        isFirstItem (index) {
            return index === 0;
        },

        isLastItem (index) {
            if (this._model.children) {
                return index === this._model.children.length - 1;
            } else {
                return false;
            }
        },

        isFolderItem (model) {
            return model.children && model.children.length > -1;
        },

        onItemClick (model) {
            this.$dispatch('item-click', {
                model: model
            });
        },

        toggleItem (model) {
            model.expanded ? this.collapseItem(model) : this.expandItem(model);
            this.$dispatch('item-toggle', {
                model: model,
                expanded: model.expanded
            });
        },

        expandItem (model) {
            if (!this.isFolderItem(model)) return;

            model.expanded = true;
            this.$dispatch('item-expand', {
                model: model
            });
        },

        collapseItem (model) {
            if (!this.isFolderItem(model)) return;

            model.expanded = false;
            this.$dispatch('item-collapse', {
                model: model
            });
        },

        expandAll (model) {
            var self = this;
            model = model || this._model;
            if (this.isFolderItem(model)) {
                model.children.forEach(function (child) {
                    self.expandItem(child);
                    self.expandAll(child);
                });
            }
        },

        collapseAll (model) {
            var self = this;
            model = model || this._model;
            if (this.isFolderItem(model)) {
                model.children.forEach(function (child) {
                    self.collapseItem(child);
                    self.collapseAll(child);
                });
            }
        },

        getRoot () {
            var target = this;
            while (!this.isRoot(target.level)) {
                target = target.$parent;
            }
            return target;
        },

        getRootModel () {
            return this.getRoot()._model;
        }
    }
});
/*   track-by=$index */
if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "<ul :class=\"{'treeview': isRoot(level)}\"><treeview-item v-for=\"child in _model.children\" :class=\"'level-'+(level+1)\" :model=child :level=level+1 :index=$index :expanded.sync=child.expanded :first-child=isFirstItem($index) :last-child=isLastItem($index) :is-root=isRoot :is-folder-item=isFolderItem :toggle-item=toggleItem @click.stop=onItemClick(child)><span slot=indent v-for=\"i in level\" class=indent></span><treeview slot=child v-if=isFolderItem(child) v-show=child.expanded :level=level+1 :root-visible=false :model.sync=child></treeview></treeview-item></ul>"
