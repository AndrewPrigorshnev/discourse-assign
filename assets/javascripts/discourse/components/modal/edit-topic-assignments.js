import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import I18n from "I18n";
import { Assignment } from "../../models/assignment";

// fixme andrei validation?
export default class EditTopicAssignments extends Component {
  @service taskActions;
  @tracked assignments = [];

  constructor() {
    super(...arguments);
    // fixme andrei simplify mapping
    const topicAssignment = new Assignment(
      this.topic.assigned_to_user?.username,
      this.topic.assigned_to_group?.name,
      this.topic.assignment_status,
      this.topic.assignment_note,
      this.topic.id,
      "Topic"
    );
    this.assignments.push(topicAssignment);

    this.topic.assignedPosts().forEach((a) => {
      this.assignments.push(
        new Assignment(
          a.assigned_to.username,
          a.assigned_to.name,
          a.assignment_status,
          a.assignment_note,
          a.postId,
          "Post",
          a.post_number
        )
      );
    });
  }

  get title() {
    const title = this.topic.isAssigned() ? "reassign_title" : "title";
    return I18n.t(`discourse_assign.assign_modal.${title}`);
  }

  get topic() {
    return this.args.model.topic;
  }

  @action
  async submit() {
    this.args.closeModal();
    await this.#assign(this.assignments);
  }

  async #assign(assignments) {
    for (const assignment of assignments) {
      await this.taskActions.assignAlt(assignment); // fixme andrei showAjaxError
    }
  }
}
