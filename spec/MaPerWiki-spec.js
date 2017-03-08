'use babel';

import MaPerWiki from '../lib/Main';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('Activate MaPerWiki', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    //workspaceElement = atom.views.getView(atom.workspace);
    //activationPromise = atom.packages.activatePackage('MaPerWiki');

      waitsForPromise(() =>{
        return atom.packages.activatePackage("MaPerWiki").then((result)=>{
        });
      });


  });

  it("should have waited long enough", ()=>{

    return expect(atom.packages.isPackageActive("MaPerWiki")).toBe(true);
  });

  describe("When MaPerWiki.toggleToc event is triggered", () =>{
    it("hides and shows the Toc panel",()=>{

    });
  });

  /*
  describe('when the MaPerWiki:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.MaPerWiki')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'MaPerWiki:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.MaPerWiki')).toExist();

        let mySandboxPackageElement = workspaceElement.querySelector('.MaPerWiki');
        expect(mySandboxPackageElement).toExist();

        let mySandboxPackagePanel = atom.workspace.panelForItem(mySandboxPackageElement);
        expect(mySandboxPackagePanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'MaPerWiki:toggle');
        expect(mySandboxPackagePanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.MaPerWiki')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'MaPerWiki:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let mySandboxPackageElement = workspaceElement.querySelector('.MaPerWiki');
        expect(mySandboxPackageElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'MaPerWiki:toggle');
        expect(mySandboxPackageElement).not.toBeVisible();
      });
    });
  });
  */
});
