# frozen_string_literal: true

module PageObjects
  module PopupMenus
    class Post < PageObjects::Pages::Base
      MENU_SELECTOR = ".popup-menu"

      def click_unassign
        find("#{MENU_SELECTOR} .popup-menu-btn .d-icon-user-plus").click
      end

      def click_reassign
        find("#{MENU_SELECTOR} .popup-menu-btn .d-icon-group-plus").click
      end
    end
  end
end
