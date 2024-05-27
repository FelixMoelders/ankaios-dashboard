<template>
  <div class="row justify-evenly">
    <div class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal class="bg-grey-2">
          <q-card-section class="bg-secondary">
            <q-icon name="auto_awesome_motion" size="md" color="white" />
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <div class="text-h5 q-mt-sm q-mb-xs">
              <b>{{ numberOfWorkloads }}</b>
            </div>
            <div class="text-caption text-grey">Workloads</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal class="bg-grey-2">
          <q-card-section class="bg-secondary">
            <q-icon name="widgets" size="md" color="white" />
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <div class="text-h5 q-mt-sm q-mb-xs">
              <b>{{ numberOfAgents }}</b>
            </div>
            <div class="text-caption text-grey">Agents</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal class="bg-grey-2">
          <q-card-section class="bg-secondary">
            <q-icon name="mediation" size="md" color="white" />
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <div class="text-h5 q-mt-sm q-mb-xs">
              <b>{{ numberOfDependencies }}</b>
            </div>
            <div class="text-caption text-grey">Dependencies</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal class="bg-grey-2">
          <q-card-section class="bg-secondary">
            <q-icon name="code" size="md" color="white" />
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <div class="text-h5 q-mt-sm q-mb-xs">
              <b>{{ numberOfRuntimes }}</b>
            </div>
            <div class="text-caption text-grey">{{ strRuntimes }}</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
