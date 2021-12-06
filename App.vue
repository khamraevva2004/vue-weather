<template>
  <div id="app">
    <div class="search">
      <input type="text" placeholder="Search Location" v-model="search" />
      <img src="@/assets/icons/search.svg" alt="Search" @click="onSearch" />
    </div>

    <div class="container">
      <ul class="slider">
        <li class="active"></li>
        <li></li>
        <li></li>
      </ul>
    </div>
    <template v-if="weather">
      <div class="weather">
        <div class="icon">
          <img
            @click="mutate"
            :src="`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`"
            alt=""
          />
        </div>
        <div class="name">
          {{ weather.name }}
          <img src="@/assets/icons/vector.svg" alt="" />
        </div>
        <div class="temperature">
          {{ k2c(weather.main.temp) }}<span>o</span>
        </div>
      </div>

      <div class="advanced">
          <div class="item">
              <span class="param">Time</span>
              <span class="value">{{ lastUpdated }}</span>
          </div>
          <div class="item">
              <span class="param">Wind</span>
              <span class="value">{{ Math.round(weather.wind.speed) }} m/s</span>
          </div>
          <div class="item">
              <span class="param">Feels like</span>
              <span class="value">{{ k2c(weather.main.feels_like) }}°</span>
          </div>
          <div class="item">
              <span class="param">AP</span>
              <span class="value">{{ weather.main.pressure }} hPa</span>
          </div>
      </div>
      <div class="day-graph">
          <div class="title">SUNRISE & SUNSET</div>
          <div class="graph">
              <div class="sunrise">{{ utcToCurrentTime(weather.sys.sunrise) }}</div>
              <div class="sunset">{{ utcToCurrentTime(weather.sys.sunset) }}</div>
              <img src="@/assets/day_graph.svg" alt="">
          </div>
          <div class="remaining">
              <div class="item"><span>Length of day:</span> {{ lod }}</div>
              <div class="item"><span>Remaining daylight:</span> {{ 'Sun is down now' || rd }}</div>
          </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { mapState } from 'vuex';
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

export default {
  name: "App",
  components: { VueperSlides, VueperSlide },
  data() {
    return {
      weather: null,
      search: "",
      city: "moscow",
      lastUpdated: null,
      lod: null,
      rd: null,
      isSunset: false
    };
  },
  methods: {
    k2c(K) {
      // K − 273,15 =  °C
      return Math.round(K - 273.15);
    },
    utcToCurrentTime(utc) {
        return moment.unix(utc).format('HH:mm A')
    },
    onSearch() {
      this.city = this.search;
      this.loadData();
      this.search = "";
    },
    formatDifference(start, end) {
        let duration = moment.duration(end.diff(start))

        let hours = Math.round(duration.asHours())
        let minutes = Math.round(duration.asMinutes())
        if (hours < 0 || minutes < 0) {
            return false
        } else {
            return `${hours}H ${Math.round(minutes - hours*60)}M`
        }
    },
    loadData() {
      //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
      axios
        .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=de4db4774ef6d48bb6c4a5e8af829be3`
        )
        .then((result) => {
            this.lastUpdated = moment().format('HH:mm A')
            //sys.sunrise && sys.sunset

            let sunrise = moment.unix(result.data.sys.sunrise)
            let sunset = moment.unix(result.data.sys.sunset)
            this.lod = this.formatDifference(sunrise, sunset)
            this.rd = this.formatDifference(moment(), sunset)

            if (sunset.isSameOrAfter(moment().utcOffset(result.data.timezone))) {
                this.isSunset = true
            }

            this.weather = result.data;
        });
    },
    mutate() {
        this.$store.commit('ADD_GOOD', 2);
    },
    computed: mapState(['goods_count']),
  },
  mounted() {
    this.loadData();
  },
};


</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

input,
select,
textarea,
button {
  outline: none;
  font-family: "Poppins", sans-serif;
  font-size: 15px;
}

body {
  font-family: "Poppins", sans-serif;
  font-size: 15px;
}

#app {
  padding: 44px 24px;
}

.search {
  position: relative;
  margin-bottom: 17px;
}

.search input {
  width: 100%;
  height: 46px;

  border: 0;
  border-radius: 15px;

  background: #f6f6fc;
  padding: 0 40px 0 20px;
}

.search input::placeholder {
  color: #c4c4c4;
}

.search img {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
}

.slider {
  list-style: none;
  background: #f6f6fc;
  display: inline-block;
  margin: 0 auto;
  padding: 7px 16px;
  border-radius: 5px;
  font-size: 0;
  margin-bottom: 10px;
}

.slider li {
  width: 8px;
  height: 8px;
  background: #c4c4c4;
  border-radius: 4px;
  display: inline-block;
}

.slider li:not(:last-child) {
  margin-right: 12px;
}

.slider li.active {
  background: #001f70;
}

.container {
  text-align: center;
}

.weather {
  text-align: center;
}

.weather .icon img {
  width: 120px;
  height: auto;
  transform: scale(1.8);
}

.weather .name {
  font-weight: 600;
  font-size: 30px;
  line-height: 45px;
  color: #2c2c2c;
}

.weather .temperature {
  font-size: 70px;
  font-weight: 500;
  line-height: 105px;
}

.weather .temperature span {
    font-size: 15px;
    vertical-align: text-top;
    line-height: 45px;
    position: relative;
}

.advanced, .day-graph {
    background: #F6F6FC;
    border-radius: 11px;
    padding: 6px 20px 10px;
    display: flex;
}

.advanced .item {
    width: 25%;
    text-align: center;
}

.advanced .item span {
    display: block;
    line-height: 150%;
}

.advanced .item .param {
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 2px;
    color: #C4C4C4;
}

.advanced .item .value {
    color: #9A9A9A;
}

.day-graph {
    display: block;
    margin-top: 11px;
    padding: 15px 20px;
}

.day-graph .title {
    color: #C4C4C4;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 500;
    margin-bottom: 32px;
}

.day-graph .graph {
    position: relative;
}

.day-graph .graph img {
    width: 100%;
}

.day-graph .graph .sunset,
.day-graph .graph .sunrise {
    color: #9A9A9A;
    font-size: 12px;
    display: block;
    width: 80px;
    text-align: center;
    position: absolute;
    top: 13%;
    transform: translate(-50%, 0%);
}

.day-graph .graph .sunset {
    left: 82%;
}

.day-graph .graph .sunrise {
    left: 17%;
} 

.remaining {
    margin-top: 16px;
    font-size: 12px;
}

.remaining .item:not(:last-child) {
    margin-bottom: 2px;
}

.remaining span {
    color: #9A9A9A;
}
</style>
