import { Font } from '@react-pdf/renderer'

let registered = false

export function registerFonts() {
  if (registered) return
  registered = true

  Font.register({
    family: 'Inter',
    fonts: [
      {
        src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ.ttf',
        fontWeight: 400,
      },
      {
        src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ.ttf',
        fontWeight: 600,
      },
      {
        src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ.ttf',
        fontWeight: 700,
      },
    ],
  })
}
