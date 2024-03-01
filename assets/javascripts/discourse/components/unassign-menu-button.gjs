import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { on } from "@ember/modifier";

export default class UnassignMenuButton extends Component {
  @service taskActions;

  @action
  async unassign() {
    console.log("unassigning...");
    await this.taskActions.unassign(this.args.postId, "Post")
    // delete this.model.topic.indirectly_assigned_to[this.model.id];
    // this.appEvents.trigger("post-stream:refresh", {
    //   id: this.topic.postStream.firstPostId,
    // });
  }

  <template>
    <button {{on "click" this.unassign}}>Unassign</button>
  </template>
}
