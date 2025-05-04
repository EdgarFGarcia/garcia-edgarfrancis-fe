<script lang="ts" setup>
  definePage({
    meta: {
      layout: "default",
    },
  });

  import {onMounted, computed, ref, watch} from "vue";
  import { useDate } from 'vuetify'
  
  /**services */
  import {storeService} from "@/services/Store.service";

  /**type */
  import Store from "@/types/Store";

  /**store */
  import {useStore} from "@/stores/Store";
  const store = useStore();

  const stores = computed(() => store.stores);
  const selectedStore = computed(() => store.selectedStore);

  onMounted(async () => {
    document.title = "Stores";
    await storeService.getStores();
  });

  const reservePop = ref<boolean>(false);
  const reserve = (item?: Store) => {
    storeService.selectedStore(item);
    reservePop.value = true;
  }

  const date = ref<string>("");
  const weekday = ref<[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const time = ref<string>("");
  const menu2 = ref(false)

  const calendar = ref()

  const today = ref([new Date().toISOString().split("T")[0]]);
  const events = ref([])
  const colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1']
  const names = ['Meeting', 'Holiday', 'Celebration', 'Travel', 'Event', 'Birthday', 'Conference', 'Party']

  onMounted(() => {
    const adapter = useDate()
    fetchEvents({ start: adapter.startOfDay(adapter.startOfMonth(new Date())), end: adapter.endOfDay(adapter.endOfMonth(new Date())) })
  })
  function fetchEvents ({ start, end }) {
    const _events = []
    const min = start
    const max = end
    const days = (max.getTime() - min.getTime()) / 86400000
    const eventCount = rnd(days, days + 20)
    for (let i = 0; i < eventCount; i++) {
      const allDay = rnd(0, 3) === 0
      const firstTimestamp = rnd(min.getTime(), max.getTime())
      const first = new Date(firstTimestamp - (firstTimestamp % 900000))
      const secondTimestamp = rnd(2, allDay ? 288 : 8) * 900000
      const second = new Date(first.getTime() + secondTimestamp)
      _events.push({
        title: names[rnd(0, names.length - 1)],
        start: first,
        end: second,
        color: colors[rnd(0, colors.length - 1)],
        allDay: !allDay,
      })
    }
    events.value = _events
  }

  const rnd = (a, b) => {
    return Math.floor((b - a + 1) * Math.random()) + a
  }

  const selectedDate = ref<string>("");
  watch(selectedDate, (newDate) => {
    alert('Yes it is available')
  });

</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="3"
        v-for="(store, index) in stores"
        :key="index"
      >
        <v-card>
          <v-img
            src="https://img.freepik.com/free-vector/shop-with-sign-we-are-open_52683-38687.jpg?t=st=1746321438~exp=1746325038~hmac=c3b390e33de0a11af5fe1b2e30a5ef48119ef21ed56222220f5369fbd2688dce&w=2000"  
          >
          </v-img>
          <v-card-item>
            <v-card-title>
              <v-badge
                :content="store.is_open ? 'Open' : 'Closed'"
                overlap
                :color="store.is_open ? 'green' : 'red'"
              >
                <span style="font-size: 1.2rem; font-weight: 500;">{{ store.name }}</span>
              </v-badge>
            </v-card-title>
            <v-card-subtitle>
              <span 
                v-if="store.is_open"
                style="font-size: 1rem; font-weight: 400;"
              >
                {{ store.address }}
              </span>
              <span v-else>
                <span style="font-size: 1rem; font-weight: 400;">Store schedule</span><br/>
                <span v-for="(day, index) in store.hours" :key="index">
                  <v-chip
                    class="mx-1"
                    size="small"
                  >
                    <span style="font-size: .9rem; font-weight: 700;">{{ day.day_of_week }}: {{ day.open_time }} - {{ day.close_time }}</span>
                  </v-chip>
                  <br/>
                </span>
              </span>
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <v-row
              align="center"
              class="mx-0"
            >
              <v-rating
                :model-value="4.5"
                color="amber"
                density="compact"
                size="small"
                half-increments
                readonly
              ></v-rating>

              <div class="text-grey ms-4">
                4.5 (413)
              </div>
            </v-row>

            <div class="my-4 text-subtitle-1">
              $ • Italian, Cafe
            </div>

            <span style="font-style: oblique; font-size: 1rem; font-weight: 400;">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</span>
          </v-card-text>
          <v-divider class="mx-4 mb-1"></v-divider>
          <v-card-actions>
            <v-btn
              color="deep-purple-lighten-2"
              text="Reserve"
              block
              border
              @click="reserve(store)"
              :disabled="!store.is_open"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reserve Dialog -->
    <v-dialog v-model="reservePop" max-width="75dvw">
      <v-card>
        <v-card-title class="text-h5">Reserve Store</v-card-title>
        <v-card-text>
          <v-row
            class="align-center"
            justify="space-between"
            no-gutters
          >
            <v-col cols="12">
              <v-date-input
                v-model="selectedDate"
                label="Reserve date"
                prepend-icon="mdi-calendar"
                variant="outlined"
              ></v-date-input>
            </v-col>
            <!-- <v-col
              cols="6"
              sm="5"
            >
              <v-text-field
                v-model="time"
                label="Pick a time"
                readonly
                variant="outlined"
              >
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  activator="parent"
                  transition="scale-transition"
                >
                  <v-time-picker
                    v-model="time"
                    full-width
                  ></v-time-picker>
                </v-menu>
              </v-text-field>
            </v-col> -->
          </v-row>
          <v-calendar
            ref="calendar"
            v-model="today"
            :events="events"
            color="primary"
            type="month"
          ></v-calendar>
          <v-row
            class="align-center"
            justify="space-between"
            no-gutters
          >
            <v-col cols="12">
              <v-text-field
                v-model="time"
                label="Pick a time"
                readonly
                variant="outlined"
              >
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  activator="parent"
                  transition="scale-transition"
                >
                  <v-time-picker
                    v-model="time"
                    full-width
                  ></v-time-picker>
                </v-menu>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="reservePop = false">Cancel</v-btn>
          <v-btn color="green" text @click="confirmReservation">Confirm</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>

  </v-container>
</template>