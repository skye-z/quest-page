import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'logo/@x1.png', 'logo/@x2.png'],
      manifest: {
        name: 'Quest',
        short_name: 'Quest',
        description: 'a ultra mini system for question bank management and mock exams',
        theme_color: '#1f2937',
        icons: [
          {
            src: 'logo/@x1.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo/@x2.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        cacheId: 'quest-cache',
        navigateFallback: null
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:80/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  }
})
