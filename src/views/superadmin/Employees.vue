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
          <label class="text-gray-500 text-xs">Email</label>
          <input
              v-model="newUser.email"
              class="border rounded-lg p-2 text-sm w-full"
              placeholder="Email"
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
          <label class="text-gray-500 text-xs">RFID card ID</label>
          <input
              v-model="newUser.card_id"
              class="border rounded-lg p-2 text-sm w-full"
              placeholder="RFID card ID"
          />
        </div>

        <div class="flex justify-end mt-3">

          <button
              class="pushable save"
              :disabled="!canCreate"
              @click="createEmployee"
          >
            <span class="shadow"></span>
            <span class="edge"></span>

            <span class="front">
              <i class="fa-solid fa-plus"></i>
              Create
            </span>
          </button>

        </div>

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

          <div class="grid grid-cols-[70px_1fr] items-center gap-2">
            <label class="text-gray-500 text-xs mr-1">Name</label>
            <input
                v-model="u.name"
                class="border rounded-lg p-2 text-sm w-full"
                placeholder="Name"
            />
          </div>

          <div class="grid grid-cols-[70px_1fr] items-center gap-2">
            <label class="text-gray-500 text-xs mr-1">Nickname</label>
            <input
                v-model="u.nickname"
                class="border rounded-lg p-2 text-sm w-full"
                placeholder="Nickname"
            />
          </div>

          <div class="grid grid-cols-[70px_1fr] items-center gap-2">
            <label class="text-gray-500 text-xs mr-1">Email</label>
            <input
                v-model="u.email"
                class="border rounded-lg p-2 text-sm w-full"
                placeholder="Email"
            />
          </div>

          <div class="grid grid-cols-[70px_1fr] items-center gap-2">
            <label class="text-gray-500 text-xs">RFID card ID</label>
            <input
                v-model="u.cardId"
                class="border rounded-lg p-2 text-sm w-full"
                placeholder="RFID card ID"
            />
          </div>

          <div class="grid grid-cols-[70px_1fr] items-center gap-2">
            <label class="text-gray-500 text-xs">Points</label>

            <div class="rounded-lg p-2 text-sm text-gray-700 w-full">
              <span class="font-semibold">{{ u.points }}</span>
            </div>
          </div>

        </div>

        <div class="flex justify-end gap-2 mt-3">

          <button class="pushable update" @click="saveEmployee(u)">
            <span class="shadow"></span>
            <span class="edge"></span>
            <span class="front">
              <i class="fa-solid fa-floppy-disk"></i>
              Save
            </span>
          </button>

          <button class="pushable delete" @click="deleteEmployee(u.id)">
            <span class="shadow"></span>
            <span class="edge"></span>
            <span class="front">
              <i class="fa-solid fa-trash"></i>
              Delete
            </span>
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
        card_id: '',
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
                card_id: created.card_id ?? newUser.value.card_id,
                role_name: created.role_name || newUser.value.role_name
            }

            employees.value.unshift(normalizedUser)

            originalEmployees.value.unshift(JSON.parse(JSON.stringify(normalizedUser)))

            newUser.value = {
                name: '',
                nickname: '',
                email: '',
                role_name: 'employee',
                card_id: '',
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
                name: user.name,
                nickname: user.nickname,
                email: user.email,
                role_name: user.role_name,
                card_id: user.card_id
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
</script>

<style scoped>
  .btn-soft {
    padding: 6px 12px;
    font-size: 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  }

  .btn-soft.save {
    background: #3b82f6;
    color: white;
  }

  .btn-soft.save:hover {
    transform: translateY(-1px);
  }

  .btn-soft.delete {
    background: #fff;
    color: #ef4444;
    border: 1px solid #fecaca;
  }
</style>