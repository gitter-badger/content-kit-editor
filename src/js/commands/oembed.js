import Command from './base';
import Prompt from '../views/prompt';
import Message from '../views/message';
import { inherit } from 'content-kit-utils';
import { OEmbedder } from '../utils/http-utils';

/*
function loadTwitterWidgets(element) {
  if (window.twttr) {
    window.twttr.widgets.load(element);
  } else {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'http://platform.twitter.com/widgets.js';
    document.head.appendChild(script);
  }
}
*/

function OEmbedCommand(options) {
  Command.call(this, {
    name: 'embed',
    button: '<i class="ck-icon-embed"></i>',
    prompt: new Prompt({
      command: this,
      placeholder: 'Paste a YouTube or Twitter url...'
    })
  });

  this.embedService = new OEmbedder({ url: options.serviceUrl });
}
inherit(OEmbedCommand, Command);

OEmbedCommand.prototype.exec = function(url) {
  var command = this;
  var embedIntent = command.embedIntent;

  embedIntent.showLoading();
  this.embedService.fetch({
    url: url,
    complete: function(response, error) {
      embedIntent.hideLoading();
      if (error) {
        var errorMsg = error;
        if (error.target && error.target.status === 0) {
          errorMsg = 'Error: could not connect to embed service.';
        } else if (typeof error !== 'string') {
          errorMsg = 'Error: unexpected embed error.';
        }
        new Message().showError(errorMsg);
        embedIntent.show();
      } else if (response.error_message) {
        new Message().showError(response.error_message);
        embedIntent.show();
      } else {
        throw new Error('Unimplemented EmbedModel is not a thing');
      }
    }
  });
};

export default OEmbedCommand;
