# frozen_string_literal: true

module PageObjects
  module Pages
    class Topic < PageObjects::Pages::Base
      def click_assign_topic
        find("#topic-footer-button-assign").click
      end

      def click_unassign_topic
        find("#topic-footer-dropdown-reassign").click
        find("[data-value='unassign']").click
      end

      def click_edit_topic_assignment
        find("#topic-footer-dropdown-reassign").click
        find("[data-value='reassign']").click
      end

      def click_more_button_on_post(post_number)
        find(more_button_selector(post_number)).click
      end

      def has_assigned?(args)
        has_assignment_action?(action: "assigned", **args)
      end

      def has_more_button_on_post?(post_number)
        page.has_selector?(more_button_selector(post_number))
      end

      def has_unassigned?(args)
        has_assignment_action?(action: "unassigned", **args)
      end

      def has_assignment_action?(args)
        assignee = args[:group]&.name || args[:user]&.username

        container =
          args[:at_post] ? find("#post_#{args[:at_post]}#{args[:class_attribute] || ""}") : page

        container.has_content?(
          I18n.t("js.action_codes.#{args[:action]}", who: "@#{assignee}", when: "just now"),
        )
      end

      private

      def more_button_selector(post_number)
        "article#post_#{post_number} p.assigned-to button.more-button"
      end
    end
  end
end
