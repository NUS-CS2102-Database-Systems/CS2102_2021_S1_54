<template>
  <v-app>
    <v-container fill-height>
      <v-navigation-drawer
        height="100%"
        width="250"
        class="petOwners"
        color="#01579B"
        fixed
        dark
        permanent
      >
        <div id="logo">
          <img
            :src="require('../../assets/petopia_logo_v4.png')"
            height="100px"
            width="256px"
          />
          <h2
            style="
              color: white;
              font-family: courier;
              text-align: center;
              font-size: 20px;
              font-weight: bold;
            "
          >
            Pet Care Service <br />
            Full-time Caretakers <br />
          </h2>
        </div>
        <v-list nav>
          <v-list-item-group>
            <v-list-item
              v-for="item in items"
              :key="item.title"
              :to="item.route"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </v-container>
  </v-app>
</template>

<script>
import {
  mdiLogout,
  mdiAccountCircle,
  mdiCheckBoxMultipleOutline,
  mdiCheckboxMarkedOutline,
  mdiCheckboxMultipleBlankOutline,
  mdiCalendarRangeOutline,
} from "@mdi/js";

export default {
  name: "FullTimeCaretakerNavBar",

  data() {
    return {
      items: [
        {
          title: "View Past Jobs",
          icon: mdiCheckBoxMultipleOutline,
          route: "/full-time-caretakers/view-past-jobs?" + document.cookie,
        },
        {
          title: "View Ongoing Jobs",
          icon: mdiCheckboxMarkedOutline,
          route: "/full-time-caretakers/view-ongoing-jobs?" + document.cookie,
        },
        {
          title: "View Upcoming Jobs",
          icon: mdiCheckboxMultipleBlankOutline,
          route: "/full-time-caretakers/view-upcoming-jobs?" + document.cookie,
        },
        {
          title: "Apply For Leave",
          icon: mdiCalendarRangeOutline,
          route: "/full-time-caretakers/apply-for-leave?" + document.cookie,
        },
        {
          title: "View My Leaves",
          icon: mdiCalendarRangeOutline,
          route: "/full-time-caretakers/view-leaves?" + document.cookie,
        },
        {
          title: "My Profile",
          icon: mdiAccountCircle,
          route: "/full-time-caretakers/view-my-profile?" + document.cookie,
        },
        {
          title: "Log Out",
          icon: mdiLogout,
          route: "/",
        },
      ],
    };
  },
};
</script>
