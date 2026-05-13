<template>

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
        <label class="text-gray-500 text-xs">Location</label>

        <select
            v-model="e.locationId"
            class="border rounded-lg p-2 text-sm w-full bg-white"
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
            v-model="e.user_ids"
            multiple
            class="border rounded-lg p-2 text-sm w-full bg-white"
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
        <label class="text-gray-500 text-xs">Date
          {{ e.date }}</label>
        <input v-model="e.date" type="date" class="border rounded-lg p-2 text-sm w-full" />
      </div>

      <div class="grid grid-cols-3 gap-2 text-xs">

        <div>
          <label class="text-gray-500">Check-in start</label>
          <input v-model="e.openTime" type="time" class="border rounded p-2 w-full" />
        </div>

        <div>
          <label class="text-gray-500">Event start</label>
          <input v-model="e.startTime" type="time" class="border rounded p-2 w-full" />
        </div>

        <div>
          <label class="text-gray-500">Cutoff time</label>
          <input v-model="e.cutoffTime" type="time" class="border rounded p-2 w-full" />
        </div>

      </div>

      <div>
        <label class="text-gray-500 text-xs">
          Priority: {{ priorityLabel(e.points) }}
        </label>

        <input
            v-model.number="e.points"
            type="range"
            min="100"
            max="300"
            step="100"
            class="nice-slider"
            :style="getSliderStyle(e.points)"
        />
      </div>

    </div>

    <div class="flex justify-end gap-2 mt-3">

      <button
          class="pushable save"
          :disabled="!canSaveEvent(e)"
          @click="saveEvent(e)"
      >
        <span class="shadow"></span>
        <span class="edge"></span>

        <span class="front">
          <i class="fa-solid fa-floppy-disk"></i>
          Save
        </span>
      </button>

      <button
          class="pushable delete"
          @click="deleteEvent(e.id)"
      >
        <span class="shadow"></span>
        <span class="edge"></span>

        <span class="front">
          <i class="fa-solid fa-trash"></i>
          Delete
        </span>
      </button>

    </div>

  </div>
</template>

<script setup>
    import { ref } from 'vue'
    import {
        updateEvent,
        deleteEvent as deleteEventApi
    } from '../../../services/api'
    import { useToast } from '../../../composables/useToast'

    const props = defineProps({
        events: Array,
        originalEvents: Array,
        locations: Array,
        users: Array,
        token: String
    })
    const emit = defineEmits(['delete', 'save'])

    const { showToast } = useToast()
    const loading = ref(true)

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

    const toDatetime = (date, time) => {
        if (!date || !time) return null
        return `${date} ${time}:00`
    }

    const nowTime = () => {
        const now = new Date()
        return now
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

    const getSliderStyle = (val) => {
        const min = 100
        const max = 300

        const percent = ((val - min) / (max - min)) * 100

        return {
            '--fill': `${percent}%`,
            '--c': '#f69900'
        }
    }

    const canSaveEvent = (e) => {
        if (!e.name || !e.date || !e.openTime || !e.startTime || !e.cutoffTime) {
            return false
        }

        const open = new Date(`${e.date}T${e.openTime}:00`)
        const start = new Date(`${e.date}T${e.startTime}:00`)
        const cutoff = new Date(`${e.date}T${e.cutoffTime}:00`)
        const now = new Date()

        if (open < now) return false
        if (start < open) return false
        if (cutoff < start) return false

        return true
    }

    const saveEvent = async (event) => {
        const error = validateEventTimes(newEvent.value)
        if (error) {
            showToast(error, 'error')
            return
        }

        try {
            await updateEvent(event.id, {
                name: event.name,
                description: event.description,
                location_id: event.location_id,
                points: event.points,
                date: event.date,
                open_time: toDatetime(event.date, event.open_time),
                start_time: toDatetime(event.date, event.start_time),
                cutoff_time: toDatetime(event.date, event.cutoff_time),
                user_ids: event.user_ids || []
            }, props.token)

            showToast('Event information saved', 'success')
        } catch (e) {
            showToast('Save failed: ' + e.message, 'error')
        }
    }

    const deleteEvent = async (id) => {
        try {
            await deleteEventApi(id, props.token)

            emit('delete', id)

            showToast('Event deleted', 'success')
        } catch (e) {
            showToast('Delete failed: ' + e.message, 'error')
        }
    }
</script>
<style scoped>
  .nice-slider {
    --c: #f69900;
    --s: 28px;

    width: 100%;
    display: block;

    height: var(--s);
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    cursor: pointer;
  }

  /* track with fill */
  .nice-slider::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 999px;

    background: linear-gradient(
        to right,
        #f69900 0%,
        #f69900 var(--fill, 50%),
        #e5e7eb var(--fill, 50%),
        #e5e7eb 100%
    );
  }

  .nice-slider::-moz-range-track {
    height: 6px;
    border-radius: 999px;

    background: linear-gradient(
        to right,
        #f69900 0%,
        #f69900 var(--fill, 50%),
        #e5e7eb var(--fill, 50%),
        #e5e7eb 100%
    );
  }

  /* thumb */
  .nice-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;

    height: var(--s);
    width: var(--s);
    border-radius: 50%;

    background: white;
    border: 3px solid var(--c);

    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    margin-top: -11px;

    transition: transform 0.2s ease;
  }

  .nice-slider::-moz-range-thumb {
    height: var(--s);
    width: var(--s);
    border-radius: 50%;

    background: white;
    border: 3px solid var(--c);

    box-shadow: 0 4px 12px rgba(0,0,0,0.15);

    transition: transform 0.2s ease;
  }

  .nice-slider:active::-webkit-slider-thumb,
  .nice-slider:active::-moz-range-thumb {
    transform: scale(1.2);
  }
</style>