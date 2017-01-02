"use babel";
import Vue from "vue";

var selfInstance;
export default class LinkCheckerStatusbarController
{

  Init()
  {
    this.vue = new Vue({
      el: this.domElement,
      components: {
      },
      data: this.viewModel,
      methods: {
        onShowLinkCheckerClick: ()=>{
          this.viewModel.showLinkChecker();
        }
      }
    });
    this.domElement.style.display = "inline-block";
  }

  constructor(view, viewModel)
  {
    selfInstance = this;
    this.view = view;
    this.domElement = this.view.getTemplateElement();
    this.viewModel = viewModel;

    var t0 = performance.now();
    this.Init();
    var t1 = performance.now();
    console.log("Call to LinkCheckerStatusbarController.constructor took " + (t1 - t0) + " milliseconds.")
  }

  dispose(){
    this.view.destroy();
  }


}
