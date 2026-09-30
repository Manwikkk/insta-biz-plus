/** A pointy-top hexagon of circumradius `r` (any CSS length) centred in its box, as a clip-path. */
export const hexClip = (r: string) =>
  `polygon(50% calc(50% - ${r}), calc(50% + ${r} * 0.866) calc(50% - ${r} * 0.5), calc(50% + ${r} * 0.866) calc(50% + ${r} * 0.5), 50% calc(50% + ${r}), calc(50% - ${r} * 0.866) calc(50% + ${r} * 0.5), calc(50% - ${r} * 0.866) calc(50% - ${r} * 0.5))`
