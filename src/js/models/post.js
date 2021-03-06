export const POST_TYPE = 'post';

// FIXME: making sections a linked-list would greatly improve this
export default class Post {
  constructor() {
    this.type = POST_TYPE;
    this.sections = [];
  }
  appendSection(section) {
    this.sections.push(section);
  }
  prependSection(section) {
    this.sections.unshift(section);
  }
  replaceSection(section, newSection) {
    this.insertSectionAfter(newSection, section);
    this.removeSection(section);
  }
  insertSectionAfter(section, previousSection) {
    let foundIndex = -1;

    for (let i=0; i<this.sections.length; i++) {
      if (this.sections[i] === previousSection) {
        foundIndex = i;
        break;
      }
    }

    this.sections.splice(foundIndex+1, 0, section);
  }
  removeSection(section) {
    var i, l;
    for (i=0,l=this.sections.length;i<l;i++) {
      if (this.sections[i] === section) {
        this.sections.splice(i, 1);
        return;
      }
    }
  }
  getPreviousSection(section) {
    var i, l;
    if (this.sections[0] !== section) {
      for (i=1,l=this.sections.length;i<l;i++) {
        if (this.sections[i] === section) {
          return this.sections[i-1];
        }
      }
    }
  }
}
