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
            Part-time Caretakers <br />
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
} from "@mdi/js";

export default {
  name: "PartTimeCaretakerNavBar",

  data() {
    return {
      items: [
        {
          title: "View Past Jobs",
          icon: mdiCheckBoxMultipleOutline,
          route: "/part-time-caretakers/view-past-jobs?" + document.cookie,
        },
        {
          title: "View Ongoing Jobs",
          icon: mdiCheckboxMarkedOutline,
          route: "/part-time-caretakers/view-ongoing-jobs?" + document.cookie,
        },
        {
          title: "View Upcoming Jobs",
          icon: mdiCheckboxMultipleBlankOutline,
          route: "/part-time-caretakers/view-upcoming-jobs?" + document.cookie,
        },
        {
          title: "My Profile",
          icon: mdiAccountCircle,
          route: "/part-time-caretakers/view-my-profile?" + document.cookie,
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
