/** A pointy-top hexagon of circumradius `r` centred at (`cx`, `cy`) in its box (any CSS lengths or percentages), as a clip-path. */
export const hexClipAt = (r: string, cx: string, cy: string) =>
  `polygon(${cx} calc(${cy} - ${r}), calc(${cx} + ${r} * 0.866) calc(${cy} - ${r} * 0.5), calc(${cx} + ${r} * 0.866) calc(${cy} + ${r} * 0.5), ${cx} calc(${cy} + ${r}), calc(${cx} - ${r} * 0.866) calc(${cy} + ${r} * 0.5), calc(${cx} - ${r} * 0.866) calc(${cy} - ${r} * 0.5))`

/** The same hexagon centred in its box. */
export const hexClip = (r: string) => hexClipAt(r, '50%', '50%')
