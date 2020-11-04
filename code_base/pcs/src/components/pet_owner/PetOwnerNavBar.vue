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
          <a href='/pet-owners'>
            <img
              :src="require('../../assets/petopia_logo_v4.png')"
              height="100px"
              width="256px"
            />
          </a>
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
            Pet Owners <br />
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
  mdiAccountGroup,
  mdiAccountCircle,
  mdiCheckBoxMultipleOutline,
  mdiCheckboxMarkedOutline,
  mdiCheckboxMultipleBlankOutline,
  mdiPaw,
} from "@mdi/js";

export default {
  name: "PetOwnerNavBar",

  data() {
    return {
      items: [
        {
          title: "View Past Jobs",
          icon: mdiCheckBoxMultipleOutline,
          route: "/pet-owners/view-past-jobs?" + document.cookie,
        },
        {
          title: "View Ongoing Jobs",
          icon: mdiCheckboxMarkedOutline,
          route: "/pet-owners/view-ongoing-jobs?" + document.cookie,
        },
        {
          title: "View Upcoming Jobs",
          icon: mdiCheckboxMultipleBlankOutline,
          route: "/pet-owners/view-upcoming-jobs?" + document.cookie,
        },
        {
          title: "Caretakers' Profiles",
          icon: mdiAccountGroup,
          route: "/pet-owners/view-caretakers-profiles",
        },
        {
          title: "My Profile",
          icon: mdiAccountCircle,
          route: "/pet-owners/view-my-profile?" + document.cookie,
        },
        {
          title: "My Pets",
          icon: mdiPaw,
          route: "/pet-owners/view-my-pets?" + document.cookie,
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
