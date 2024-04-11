export function extendTopicModel(api, pluginId) {
  api.modifyClass("model:topic", {
    pluginId,

    assignees() {
      const result = [];

      if (this.assigned_to_user) {
        result.push(this.assigned_to_user);
      }

      const postAssignees = this.assignedPosts().map((p) => p.assigned_to);
      result.push(...postAssignees);
      return result;
    },

    uniqueAssignees() {
      const map = new Map();
      this.assignees().forEach((user) => map.set(user.username, user));
      return [...map.values()];
    },

    // fixme andrei rename to postAssignment()
    assignedPosts() {
      if (!this.indirectly_assigned_to) {
        return [];
      }

      return Object.entries(this.indirectly_assigned_to).map(([key, value]) => {
        value.postId = key;
        return value;
      });
    },

    isAssigned() {
      return this.assigned_to_user || this.assigned_to_group;
    },

    isAssignedTo(user) {
      return this.assigned_to_user?.username === user.username;
    },

    hasAssignedPosts() {
      return !!this.assignedPosts().length;
    },
  });
}
