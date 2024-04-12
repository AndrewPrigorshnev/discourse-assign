import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import I18n from "I18n";
import { Assignment } from "../../models/assignment";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default class EditTopicAssignments extends Component {
  @service taskActions;
  @tracked assignments = [];

  constructor() {
    super(...arguments);

    // fixme simplify further
    const topicAssignment = Assignment.fromTopic(this.topic);
    this.assignments.push(topicAssignment);
    this.topic.assignedPosts().forEach((a) => {
      this.assignments.push(Assignment.fromPost(a));
    });
  }

  get title() {
    if (this.topic.isAssigned() || this.topic.hasAssignedPosts()) {
      return I18n.t("edit_assignments_modal.title");
    } else {
      return I18n.t("discourse_assign.assign_modal.title");
    }
  }

  get topic() {
    return this.args.model.topic;
  }

  @action
  async submit() {
    this.args.closeModal();
    try {
      await this.#assign();
    } catch (error) {
      popupAjaxError(error);
    }
  }

  async #assign() {
    for (const assignment of this.assignments) {
      if (assignment.isEdited) {
        await this.taskActions.putAssignment(assignment);
      }
    }
  }
}
