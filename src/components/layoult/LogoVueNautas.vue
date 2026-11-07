<template>
  <svg
    class="logo-vuenautas"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Logo VueNautas"
  >
    <!-- Órbita -->
    <ellipse
      cx="32"
      cy="32"
      rx="28"
      ry="12"
      transform="rotate(-35 32 32)"
      stroke="currentColor"
      stroke-width="2"
      opacity="0.7"
    />

    <!-- Planeta -->
    <circle
      cx="32"
      cy="32"
      r="18"
      fill="#35495E"
    />

    <!-- Superfície do planeta -->
    <path
      d="M20 23C24 19 29 18 34 19L29 25L22 28L20 23Z"
      fill="#42B883"
    />

    <path
      d="M35 30L45 27L49 34L42 42L35 39L35 30Z"
      fill="#65D6A0"
    />

    <!-- Letra V -->
    <path
      d="M23 25L32 43L41 25"
      stroke="#FFFFFF"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Estrela -->
    <circle cx="53" cy="12" r="3" fill="#42B883" />
  </svg>
</template>

<style scoped>
.logo-vuenautas {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  color: var(--cor-primaria);
}
</style>