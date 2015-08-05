import { Editor } from 'content-kit-editor';
import Helpers from '../test-helpers';
import { MOBILEDOC_VERSION } from 'content-kit-editor/renderers/mobiledoc';

const { test, module } = QUnit;

let fixture, editor, editorElement;

const mobileDocWith2Sections = {
  version: MOBILEDOC_VERSION,
  sections: [
    [],
    [
      [1, "P", [
        [[], 0, "first section"]
      ]],
      [1, "P", [
        [[], 0, "second section"]
      ]]
    ]
  ]
};

module('Acceptance: Editor Selections', {
  beforeEach() {
    fixture = document.getElementById('qunit-fixture');
    editorElement = document.createElement('div');
    editorElement.setAttribute('id', 'editor');
    fixture.appendChild(editorElement);
  },

  afterEach() {
    if (editor) {
      editor.destroy();
    }
  }
});

test('selecting across sections is possible', (assert) => {
  const done = assert.async();

  editor = new Editor(editorElement, {mobiledoc: mobileDocWith2Sections});

  let firstSection = $('p:contains(first section)')[0];
  let secondSection = $('p:contains(second section)')[0];

  Helpers.dom.selectText('section', firstSection,
                         'second', secondSection);

  Helpers.dom.triggerEvent(document, 'mouseup');

  setTimeout(() => {
    assert.equal(editor.activeSections.length, 2, 'selects 2 sections');
    done();
  });
});

test('selecting an entire section and deleting removes it', (assert) => {
  const done = assert.async();

  editor = new Editor(editorElement, {mobiledoc: mobileDocWith2Sections});

  Helpers.dom.selectText('second section', editorElement);
  Helpers.dom.triggerKeyEvent(document, 'keydown', Helpers.dom.KEY_CODES.DELETE);

  assert.hasElement('p:contains(first section)');
  assert.hasNoElement('p:contains(second section)', 'deletes second section');

  let textNode = $('p:contains(first section)')[0].childNodes[0];
  let charOffset = textNode.textContent.length;

  assert.deepEqual(Helpers.dom.getCursorPosition(),
                   {node: textNode, offset: charOffset});

  done();
});

test('selecting text in a section and deleting deletes it', (assert) => {
  const done = assert.async();

  editor = new Editor(editorElement, {mobiledoc: mobileDocWith2Sections});

  Helpers.dom.selectText('cond sec', editorElement);
  Helpers.dom.triggerKeyEvent(document, 'keydown', Helpers.dom.KEY_CODES.DELETE);

  assert.hasElement('p:contains(first section)', 'first section unchanged');
  assert.hasNoElement('p:contains(second section)', 'second section is no longer there');
  assert.hasElement('p:contains(section)', 'second section has correct text');

  let textNode = $('p:contains(section)')[1].childNodes[0];
  let charOffset = 3; // after the 'c' in "sec"

  assert.deepEqual(Helpers.dom.getCursorPosition(),
                   {node: textNode, offset: charOffset});

  done();
});

// test selecting text across sections and deleting joins sections
// test selecting text across markers deletes intermediary markers and joins outer markers
