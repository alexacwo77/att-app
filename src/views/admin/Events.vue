<template>
  <div class="content">

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="mt-3 text-sm text-gray-500">Loading events...</p>
    </div>

    <div v-else>

      <!-- CREATE NEW -->
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
          <input v-model="newEvent.location_name" class="border rounded-lg p-2 text-sm w-full" />
        </div>

        <div>
          <label class="text-gray-500 text-xs">Description</label>
          <textarea v-model="newEvent.description" class="border rounded-lg p-2 text-sm w-full" rows="3" />
        </div>

        <!-- DATE -->
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
          <label class="text-gray-500 text-xs">Points</label>
          <input v-model.number="newEvent.points" type="number" class="border rounded-lg p-2 text-sm w-full" />
        </div>

        <button
            class="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm w-full disabled:opacity-50"
            :disabled="!canCreate"
            @click="createEvent"
        >
          Create Event
        </button>

      </div>

      <!-- EXISTING -->
      <div class="mb-2 text-lg font-semibold">
        Existing Events
      </div>

      <div
          v-for="e in events"
          :key="e.id"
          class="bg-white rounded-xl shadow-sm p-4 mb-3"
      >

        <div class="text-xs text-gray-500 mb-2">
          ID: {{ e.id }}
        </div>

        <div class="space-y-2">

          <div>
            <label class="text-gray-500 text-xs">Event name</label>
            <input v-model="e.name" class="border rounded-lg p-2 text-sm w-full" />
          </div>

          <div>
            <label class="text-gray-500 text-xs">Description</label>
            <textarea v-model="e.description" class="border rounded-lg p-2 text-sm w-full" rows="2" />
          </div>

          <!-- DATE -->
          <div>
            <label class="text-gray-500 text-xs">Date</label>
            <input v-model="e.date" type="date" class="border rounded-lg p-2 text-sm w-full" />
          </div>

          <div class="grid grid-cols-3 gap-2 text-xs">

            <div>
              <label class="text-gray-500">Check-in start</label>
              <input v-model="e.open_time" type="time" class="border rounded p-2 w-full" />
            </div>

            <div>
              <label class="text-gray-500">Event start</label>
              <input v-model="e.start_time" type="time" class="border rounded p-2 w-full" />
            </div>

            <div>
              <label class="text-gray-500">Cutoff time</label>
              <input v-model="e.cutoff_time" type="time" class="border rounded p-2 w-full" />
            </div>

          </div>

          <div>
            <label class="text-gray-500 text-xs">Points</label>
            <input v-model.number="e.points" type="number" class="border rounded-lg p-2 text-sm w-full" />
          </div>

        </div>

        <!-- ACTIONS -->
        <div class="flex justify-end gap-2 mt-3">

          <button
              class="text-sm px-3 py-1 rounded-lg bg-gray-200"
              @click="resetEvent(e.id)"
          >
            Reset
          </button>

          <button
              class="text-sm px-3 py-1 rounded-lg bg-red-500 text-white"
              @click="deleteEvent(e.id)"
          >
            Delete
          </button>

          <button
              class="text-sm px-3 py-1 rounded-lg bg-blue-600 text-white"
              @click="saveEvent(e)"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import {
        getEvents,
        updateEvent,
        deleteEvent as deleteEventApi,
        createEvent as createEventApi
    } from '../../services/api'

    const events = ref([])
    const originalEvents = ref([])
    const loading = ref(true)
    const token = localStorage.getItem('token')

    const newEvent = ref({
        name: '',
        description: '',
        location_name: '',
        points: 0,
        date: '',
        open_time: '',
        start_time: '',
        cutoff_time: ''
    })

    const toTime = (dt) => dt ? dt.slice(11, 16) : ''

    const toDatetime = (date, time) => {
        if (!date || !time) return null
        return `${date} ${time}:00`
    }

    onMounted(async () => {
        try {
            loading.value = true
            const res = await getEvents(token)

            const mapped = (res.events || []).map(e => {
                const date = e.open_time?.slice(0, 10)

                return {
                    ...e,
                    date,
                    open_time: toTime(e.open_time),
                    start_time: toTime(e.start_time),
                    cutoff_time: toTime(e.cutoff_time),
                }
            })

            events.value = mapped
            originalEvents.value = JSON.parse(JSON.stringify(mapped))

        } finally {
            loading.value = false
        }
    })

    const canCreate = computed(() => {
        return (
            newEvent.value.name?.trim() &&
            newEvent.value.points > 0 &&
            newEvent.value.date &&
            newEvent.value.open_time &&
            newEvent.value.start_time
        )
    })

    const createEvent = async () => {
        try {
            const payload = {
                ...newEvent.value,
                open_time: toDatetime(newEvent.value.date, newEvent.value.open_time),
                start_time: toDatetime(newEvent.value.date, newEvent.value.start_time),
                cutoff_time: toDatetime(newEvent.value.date, newEvent.value.cutoff_time),
            }

            const created = await createEventApi(payload, token)
            const e = created.event || payload

            events.value.unshift({
                ...e,
                date: e.open_time?.slice(0, 10),
                open_time: toTime(e.open_time),
                start_time: toTime(e.start_time),
                cutoff_time: toTime(e.cutoff_time),
            })

            newEvent.value = {
                name: '',
                description: '',
                location_name: '',
                points: 0,
                date: '',
                open_time: '',
                start_time: '',
                cutoff_time: ''
            }

        } catch {
            alert('Create failed')
        }
    }

    const saveEvent = async (event) => {
        try {
            await updateEvent(event.id, {
                name: event.name,
                description: event.description,
                points: event.points,

                open_time: toDatetime(event.date, event.open_time),
                start_time: toDatetime(event.date, event.start_time),
                cutoff_time: toDatetime(event.date, event.cutoff_time),
            }, token)

            alert('Saved')
        } catch {
            alert('Save failed')
        }
    }

    const deleteEvent = async (id) => {
        try {
            await deleteEventApi(id, token)
            events.value = events.value.filter(e => e.id !== id)
        } catch {
            alert('Delete failed')
        }
    }

    const resetEvent = (id) => {
        const original = originalEvents.value.find(e => e.id === id)
        const target = events.value.find(e => e.id === id)

        if (original && target) {
            Object.assign(target, JSON.parse(JSON.stringify(original)))
        }
    }
</script>