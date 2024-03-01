import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { on } from "@ember/modifier";

export default class UnassignPost extends Component {
  @service taskActions;

  @action
  async unassign() {
    const post = this.args.post;
    await this.taskActions.unassignPost(post.id);
    delete post.topic.indirectly_assigned_to[post.id];
  }

  <template>
    <button {{on "click" this.unassign}}>Unassign</button>
  </template>
}
