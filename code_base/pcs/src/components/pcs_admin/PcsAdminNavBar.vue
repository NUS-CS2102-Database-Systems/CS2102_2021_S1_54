<template>
  <v-app>
    <v-container fill-height>
      <v-navigation-drawer
        height="100%"
        width="250"
        class="pcsAdmins"
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
            PCS Admins
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
  mdiClipboardCheckMultipleOutline,
  mdiHome,
  mdiAccountCircle,
  mdiCurrencyUsd,
} from "@mdi/js";

export default {
  name: "PcsAdminNavBar",

  data() {
    return {
      items: [
        {
          title: "Home",
          icon: mdiHome,
          route: "/pcs-admin/home?" + document.cookie,
        },
        {
          title: "Pets Cared For",
          icon: mdiClipboardCheckMultipleOutline,
          route:
            "/pcs-admin/view-number-of-pets-cared-for-per-caretaker?" +
            document.cookie,
        },
        {
          title: "Set Base Daily Price",
          icon: mdiCurrencyUsd,
          route: "/pcs-admin/set-base-daily-price?" + document.cookie,
        },
        {
          title: "My Profile",
          icon: mdiAccountCircle,
          route: "/pcs-admin/view-my-profile?" + document.cookie,
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
