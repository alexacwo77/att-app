<template>
  <div class="content">

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="mt-3 text-sm text-gray-500">Loading employees...</p>
    </div>

    <div v-else>

      <div class="mb-2 text-lg font-semibold">
        Create New Employee
      </div>

      <div class="bg-white rounded-xl shadow-sm p-4 mb-5 space-y-3">

        <div class="space-y-1">
          <label class="text-gray-500 text-xs">Name</label>
          <input
              v-model="newUser.name"
              class="border rounded-lg p-2 text-sm w-full"
              placeholder="Name"
          />
        </div>

        <div class="space-y-1">
          <label class="text-gray-500 text-xs">Nickname</label>
          <input
              v-model="newUser.nickname"
              class="border rounded-lg p-2 text-sm w-full"
              placeholder="Nickname"
          />
        </div>

        <div class="space-y-1">
          <label class="text-gray-500 text-xs">Password</label>
          <input
              v-model="newUser.password"
              class="border rounded-lg p-2 text-sm w-full"
              placeholder="Password"
          />
        </div>

        <div class="space-y-1">
          <label class="text-gray-500 text-xs">Email</label>
          <input
              v-model="newUser.email"
              class="border rounded-lg p-2 text-sm w-full"
              placeholder="Email"
          />
        </div>

        <div class="space-y-1">
          <label class="text-gray-500 text-xs">Points</label>
          <input
              v-model.number="newUser.points"
              type="number"
              class="border rounded-lg p-2 text-sm w-full"
              placeholder="Points"
          />
        </div>

        <button
            class="w-full bg-blue-600 text-white rounded-lg py-2 text-sm disabled:opacity-50"
            :disabled="!canCreate"
            @click="createEmployee"
        >
          Create
        </button>

      </div>

      <div class="mb-2 text-lg font-semibold">
        Existing Employees
      </div>

      <div
          v-for="u in employees"
          :key="u.id"
          class="bg-white rounded-xl shadow-sm p-4 mb-3"
      >

        <div class="flex justify-between items-start mb-3">
          <div>
            <div class="font-semibold text-gray-900">
              {{ u.nickname || u.name }}
            </div>
            <div class="text-xs text-gray-500">
              ID: {{ u.id }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-2">

          <div class="space-y-1">
            <label class="text-gray-500 text-xs mr-1">Name</label>
            <input
                v-model="u.name"
                class="border rounded-lg p-2 text-sm"
                placeholder="Name"
            />
          </div>

          <div class="space-y-1">
            <label class="text-gray-500 text-xs mr-1">Nickname</label>
            <input
                v-model="u.nickname"
                class="border rounded-lg p-2 text-sm"
                placeholder="Nickname"
            />
          </div>

          <div class="space-y-1">
            <label class="text-gray-500 text-xs mr-1">Email</label>
            <input
                v-model="u.email"
                class="border rounded-lg p-2 text-sm"
                placeholder="Email"
            />
          </div>

          <div class="space-y-1">
            <label class="text-gray-500 text-xs mr-1">Points</label>
            <div class="text-gray-700 text-sm">
              <span class="font-semibold">{{ u.points }}</span>
            </div>
          </div>

        </div>

        <div class="flex justify-end gap-2 mt-3">

          <button
              class="text-sm px-3 py-1 rounded-lg bg-gray-200"
              @click="resetEmployee(u.id)"
          >
            Reset
          </button>

          <button
              class="text-sm px-3 py-1 rounded-lg bg-red-500 text-white"
              @click="deleteEmployee(u.id)"
          >
            Delete
          </button>

          <button
              class="text-sm px-3 py-1 rounded-lg bg-blue-600 text-white"
              @click="saveEmployee(u)"
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
        getEmployees,
        updateEmployee,
        deleteEmployee as deleteEmployeeApi,
        createEmployee as createEmployeeApi
    } from '../../services/api'
    import { useToast } from '../../composables/useToast'

    const { showToast } = useToast()
    const employees = ref([])
    const loading = ref(true)
    const token = localStorage.getItem('token')

    const originalEmployees = ref([])

    const newUser = ref({
        name: '',
        nickname: '',
        password: '',
        email: '',
        role_name: 'employee',
        points: 0
    })

    const canCreate = computed(() => {
        return (
            newUser.value.name?.trim() &&
            newUser.value.email?.trim()
        )
    })

    onMounted(async () => {
        try {
            loading.value = true

            const res = await getEmployees(token)

            employees.value = res.employees
            originalEmployees.value = JSON.parse(JSON.stringify(res.employees))

        } finally {
            loading.value = false
        }
    })

    const createEmployee = async () => {
        try {
            const res = await createEmployeeApi(newUser.value, token)

            const created = res.employee || res

            const normalizedUser = {
                id: created.employee_id,
                name: created.name || newUser.value.name,
                nickname: created.nickname || newUser.value.nickname,
                email: created.email || newUser.value.email,
                points: created.points ?? newUser.value.points,
                role_name: created.role_name || newUser.value.role_name
            }

            employees.value.unshift(normalizedUser)

            originalEmployees.value.unshift(JSON.parse(JSON.stringify(normalizedUser)))

            newUser.value = {
                name: '',
                nickname: '',
                email: '',
                role_name: 'employee',
                points: 0
            }

            showToast('Employee created', 'success');

        } catch (e) {
            showToast('Create failed: ' + e.message, 'error')
        }
    }

    const saveEmployee = async (user) => {
        try {
            await updateEmployee(user.id, {
                nickname: user.nickname,
                email: user.email,
                role_name: user.role_name
            }, token)

            showToast('Saved', 'success')
        } catch (e) {
            showToast('Save failed: ' + e.message, 'error')
        }
    }

    const deleteEmployee = async (id) => {
        try {
            await deleteEmployeeApi(id, token)
            employees.value = employees.value.filter(u => u.id !== id)
        } catch (e) {
            showToast('Delete failed: ' + e.message, 'error')
        }
    }

    const resetEmployee = (id) => {
        const original = originalEmployees.value.find(u => u.id === id)
        const target = employees.value.find(u => u.id === id)

        if (original && target) {
            Object.assign(target, JSON.parse(JSON.stringify(original)))
        }
    }
</script>