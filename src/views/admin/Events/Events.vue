<template>
  <div class="content">

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="mt-3 text-sm text-gray-500">Loading events...</p>
    </div>

    <div v-else>

      <div class="font-semibold text-gray-700 dark:text-white mb-2">
        Create New Event
      </div>

      <div class="bg-white rounded-xl shadow-sm p-4 mb-6 space-y-3">

        <div>
          <label class="text-gray-500 text-xs">Event name</label>
          <input v-model="newEvent.name" class="border rounded-lg p-2 text-sm w-full" />
        </div>

        <div>
          <label class="text-gray-500 text-xs">Location</label>
          <select
              v-model="newEvent.location_id"
              class="w-full border rounded p-1 text-xs"
          >
            <option
                v-for="location in locations"
                :key="location.id"
                :value="location.id"
            >
              {{ location.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-gray-500 text-xs">Participants</label>

          <select
              v-model="newEvent.user_ids"
              multiple
              class="w-full border rounded p-2 text-sm"
          >
            <option
                v-for="u in users"
                :key="u.id"
                :value="u.id"
            >
              {{ u.name }} ({{ u.nickname }})
            </option>
          </select>
        </div>

        <div>
          <label class="text-gray-500 text-xs">Date</label>
          <input v-model="newEvent.date" type="date" class="border rounded-lg p-2 text-sm w-full" />
        </div>

        <div class="grid grid-cols-3 gap-2 text-xs">

          <div>
            <label class="text-gray-500">Check-in start</label>
            <input v-model="newEvent.open_time" type="time" class="border rounded p-2 w-full" />
          </div>

          <div>
            <label class="text-gray-500">Event start</label>
            <input v-model="newEvent.start_time" type="time" class="border rounded p-2 w-full" />
          </div>

          <div>
            <label class="text-gray-500">Cutoff time</label>
            <input v-model="newEvent.cutoff_time" type="time" class="border rounded p-2 w-full" />
          </div>

        </div>

        <div>
          <label class="text-gray-500 text-xs">
            Priority: {{ priorityLabel(newEvent.points) }}
          </label>

          <input
              v-model.number="newEvent.points"
              type="range"
              min="100"
              max="300"
              step="100"
              class="w-full"
          />

        </div>

        <button
            class="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm w-full disabled:opacity-50"
            :disabled="!canCreate"
            @click="createEvent"
        >
          Create Event
        </button>

      </div>

      <ExistingEvents
          :events="events"
          :originalEvents="originalEvents"
          :locations="locations"
          :users="users"
          :token="token"
          @delete="handleDelete"
      />

    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import {
        getEvents,
        createEvent as createEventApi,
        getEmployees
    } from '../../../services/api'
    import ExistingEvents from './ExistingEvents.vue'
    import { useToast } from '../../../composables/useToast'
    import { getLocations } from '../../../services/api'

    const { showToast } = useToast()
    const locations = ref([])
    const events = ref([])
    const originalEvents = ref([])
    const users = ref([])
    const loading = ref(true)
    const token = localStorage.getItem('token')

    const newEvent = ref({
        name: '',
        description: '',
        location_name: '',
        points: 100,
        date: '',
        open_time: '',
        start_time: '',
        cutoff_time: ''
    })

    const priorityLabel = (p) => {
        switch (Number(p)) {
            case 100: return 'Low (100 pts)'
            case 200: return 'Medium (200 pts)'
            case 300: return 'High (300 pts)'
            default: return 'Low'
        }
    }

    const toTime = (dt) => dt ? dt.slice(11, 16) : ''

    const toDatetime = (date, time) => {
        if (!date || !time) return null
        return `${date} ${time}:00`
    }

    const nowTime = () => {
        return new Date()
    }

    const toDateTimeObj = (date, time) => {
        if (!date || !time) return null
        return new Date(`${date}T${time}:00`)
    }

    const validateEventTimes = (event) => {
        const open = toDateTimeObj(event.date, event.open_time || event.openTime)
        const start = toDateTimeObj(event.date, event.start_time || event.startTime)
        const cutoff = toDateTimeObj(event.date, event.cutoff_time || event.cutoffTime)

        const now = new Date()

        if (!open || !start || !cutoff) {
            return 'All times must be filled'
        }

        if (open < now) {
            return 'Check-in time cannot be in the past'
        }

        if (start < open) {
            return 'Event start cannot be before check-in'
        }

        if (cutoff < start) {
            return 'Cutoff time cannot be before event start'
        }

        return null
    }

    onMounted(async () => {
        try {
            loading.value = true

            const [eventsRes, locationsRes, usersRes] = await Promise.all([
                getEvents(token),
                getLocations(token),
                getEmployees(token)
            ])

            users.value = usersRes.employees || usersRes

            const mapped = (eventsRes.events || []).map(e => {
                const date = e.date?.slice(0, 10)

                return {
                    ...e,
                    date,
                    openTime: toTime(e.openTime),
                    startTime: toTime(e.startTime),
                    cutoffTime: toTime(e.cutoffTime),
                    user_ids: (e.eventUsers || []).map(eu => eu.userId),
                }
            })

            events.value = mapped
            originalEvents.value = JSON.parse(JSON.stringify(mapped))

            locations.value = locationsRes.locations || locationsRes

        } finally {
            loading.value = false
        }
    })

    const canCreate = computed(() => {
        const e = newEvent.value

        if (
            !e.name?.trim() ||
            !e.date ||
            !e.open_time ||
            !e.start_time ||
            !e.cutoff_time
        ) {
            return false
        }

        const open = new Date(`${e.date}T${e.open_time}:00`)
        const start = new Date(`${e.date}T${e.start_time}:00`)
        const cutoff = new Date(`${e.date}T${e.cutoff_time}:00`)
        const now = new Date()

        if (isNaN(open) || isNaN(start) || isNaN(cutoff)) {
            return false
        }

        if (open < now) return false
        if (start < open) return false
        if (cutoff < start) return false

        return true
    })

    const createEvent = async () => {
        const error = validateEventTimes(newEvent.value)
        if (error) {
            showToast(error, 'error')
            return
        }

        try {
            const payload = {
                ...newEvent.value,
                open_time: toDatetime(newEvent.value.date, newEvent.value.open_time),
                start_time: toDatetime(newEvent.value.date, newEvent.value.start_time),
                cutoff_time: toDatetime(newEvent.value.date, newEvent.value.cutoff_time),
                user_ids: newEvent.value.user_ids || []
            };

            const res = await createEventApi(payload, token);

            const eventId = res.data?.event_id;

            const newEventItem = {
                id: eventId,
                ...payload,
                date: payload.open_time?.slice(0, 10),
                open_time: newEvent.value.open_time,
                start_time: newEvent.value.start_time,
                cutoff_time: newEvent.value.cutoff_time,
            };

            events.value.unshift(newEventItem);

            newEvent.value = {
                name: '',
                description: '',
                location_id: null,
                points: 100,
                date: '',
                open_time: '',
                start_time: '',
                cutoff_time: '',
                user_ids: []
            };

            showToast('Event created', 'success');

        } catch (e) {
            showToast('Create failed: ' + e.message, 'error')
        }
    }

    const handleDelete = (id) => {
        events.value = events.value.filter(e => e.id !== id)
    }
</script>