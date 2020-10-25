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
import { mdiLogout, mdiAccountGroup, mdiCurrencyUsd,mdiClipboardCheckMultipleOutline } from "@mdi/js";

export default {
  name: "PcsAdminNavBar",

  data() {
    return {
      items: [
        {
          title: "Jobs",
          icon: mdiAccountGroup,
          route: "/pcs-admins/view-jobs",
        },
        {
          title: "View num of pets each caretaker has taken care of",
          icon: mdiClipboardCheckMultipleOutline,
          route: "/pcs-admins/Pcs-Admin-View-Num-Of-Pets-Cared-By-Each-Caretaker",
        },
        {
          title: "Salary",
          icon: mdiCurrencyUsd,
          route: "/pcs-admins/view-salary",
        },
        {
          title: "Revenue",
          icon: mdiCurrencyUsd,
          route: "/pcs-admins/view-revenue",
        },
        {
          title: "Log Out",
          icon: mdiLogout,
          route: "/log-out",
        },
      ],
    };
  },
};
</script>
