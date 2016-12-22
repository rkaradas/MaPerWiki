"use babel";
import Vue from "vue"

export default class WordcountController
{
  constructor(view, viewModel)
  {
    var t0 = performance.now();
    this.view = view;
    this.domElement = this.view.getTemplateElement();
    this.viewModel = viewModel;
    this.vue = new Vue({
        el: this.domElement,
        data: this.viewModel,

        methods: {
          close: () => {
            this.viewModel.onClose();
          }
        }

      })
      var t1 = performance.now();
      console.log("Call to WordcountController.constructor for took " + (t1 - t0) + " milliseconds.")

  }

  dispose(){
    this.view.destroy();
  }


}
