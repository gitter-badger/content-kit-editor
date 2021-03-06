import mixin from '../utils/mixin';
import EventListenerMixin from '../utils/event-listener';

const ELEMENT_TYPE = 'button';
const BUTTON_CLASS_NAME = 'ck-toolbar-btn';

class ReversibleToolbarButton {
  constructor(command, editor) {
    this.command = command;
    this.editor = editor;
    this.element = this.createElement();
    this.active = false;

    this.addEventListener(this.element, 'click', e => this.handleClick(e));
    this.editor.on('selection', () => this.updateActiveState());
    this.editor.on('selectionUpdated', () => this.updateActiveState());
    this.editor.on('selectionEnded', () => this.updateActiveState());
  }

  // These are here to match the API of the ToolbarButton class
  setInactive() {}
  setActive() {}

  handleClick(e) {
    e.stopPropagation();

    if (this.active) {
      this.command.unexec();
    } else {
      this.command.exec();
    }
  }

  updateActiveState() {
    this.active = this.command.isActive();
  }

  createElement() {
    const element = document.createElement(ELEMENT_TYPE);
    element.className = BUTTON_CLASS_NAME;
    element.innerHTML = this.command.button;
    element.title = this.command.name;
    return element;
  }

  set active(val) {
    this._active = val;
    if (this._active) {
      this.element.className = BUTTON_CLASS_NAME + ' active';
    } else {
      this.element.className = BUTTON_CLASS_NAME;
    }
  }

  get active() {
    return this._active;
  }
}

mixin(ReversibleToolbarButton, EventListenerMixin);

export default ReversibleToolbarButton;
