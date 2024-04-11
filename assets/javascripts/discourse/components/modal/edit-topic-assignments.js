import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import I18n from "I18n";
import { Assignment } from "../../models/assignment";

export default class EditTopicAssignments extends Component {
  @service taskActions;
  @tracked assignments = [];

  constructor() {
    super(...arguments);

    // fixme simplify further
    const topicAssignment = Assignment.fromTopic(this.topic);
    this.assignments.push(topicAssignment);
    this.topic.assignedPosts().forEach((a) => {
      this.assignments.push(Assignment.fromPostAssignment(a));
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
