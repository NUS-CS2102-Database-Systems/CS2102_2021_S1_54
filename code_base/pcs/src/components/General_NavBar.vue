<template>
  <v-app>
    <v-container fill-height>
      <v-navigation-drawer
        height="100%"
        width="250"
        class="general"
        color="#01579B"
        fixed
        dark
        permanent
      >
        <div id="logo">
          <img
            :src="require('../assets/petopia_logo_v4.png')"
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
            Pet Care Service
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
import { mdiLogin, mdiAccountSettings } from "@mdi/js";

export default {
  name: "GeneralNavBar",

  data() {
    return {
      items: [
        {
          title: "Sign Up",
          icon: mdiLogin,
          route: "/sign-up",
        },
        {
          title: "Log In",
          icon: mdiLogin,
          route: "/log-in",
        },
        // Disable Delete Account functionality
        // {
        //   title: "Delete Account",
        //   icon: mdiDelete,
        //   route: "/delete-account",
        // },
        {
          title: "Admin Sign Up",
          icon: mdiAccountSettings,
          route: "/admin-signup",
        },
      ],
    };
  },
};
</script>
