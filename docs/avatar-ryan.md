# Ryan Castro · avatar del estudio

## Recurso y funcionamiento

- Recurso final: `public/avatar/ryan-castro.webp`, 2048 × 1024, transparencia real, cuatro celdas de 512 × 1024.
- Orden: frente sin chaqueta, frente con chaqueta, espalda sin chaqueta, espalda con chaqueta.
- Generado con la herramienta integrada **ImageGen**. Se conserva el PNG original en el directorio de imágenes generadas de Codex. La conversión a WebP mantiene el canal alfa; no se redibujó ni alteró el contenido generado.
- Referencias de vestuario: las dos fotografías aportadas por el usuario (frente y espalda).
- Referencia de identidad: retrato promocional de Ryan Castro servido por Spotify, https://i.scdn.co/image/ab6761610000e5ebaa3d392b9f2b4470bde531c6 . Solo referencia de generación; no se incluye la foto en el sitio.
- La chaqueta mantiene `/piezas/poncho.svg` como identificador visual compatible con el catálogo existente. También se reconoce `/piezas/chaqueta-ghetto.svg`. La coincidencia exige ranura `Torso` y una de esas rutas locales exactas: no depende del nombre del ítem.
- El personaje cambia de variante al equipar o quitar la chaqueta y al alternar frente/espalda. La API y el esquema de equipamiento no cambian. Otras prendas siguen usando capas colocadas por ranura sobre la nueva silueta humana. La vista posterior usa una versión posterior de la gorra de muestra y oculta accesorios faciales.
- Movimiento: balanceo y rebote 2D mediante PixiJS; no es un modelo 3D articulado. La pausa y la preferencia de movimiento reducido detienen el ticker de movimiento. Si WebGL falla, se muestra la variante estática correspondiente a la vista y la chaqueta.

## Prompt de generación

Use case: stylized-concept. Production game sprite sheet for an interactive avatar wardrobe. Create a transparent PNG 2048x1024 (landscape 2:1) with FOUR full-body figures in ONE horizontal row in four exactly equal 512x1024 cells. Same Colombian singer RYAN CASTRO in all four, stylized high-quality 3D animated character, charming adult proportions with moderately enlarged head, sculpted face recognizable from reference 1 (short dark slicked hair with fade, shaped beard and mustache, warm tan skin, diamond stud earrings, subtle neck and hand tattoos). No hat and NO SUNGLASSES on base figure: eyes visible. Reference 1 is for identity ONLY. Reference 2 and 3 are for JACKET DESIGN. All four stand at exactly the same scale, top of hair at y100, soles y950, centers x256,768,1280,1792. Arms relaxed slightly away from body, hands visible outside sleeves, legs slightly separated, neutral straight standing pose. Orthographic camera front or back, no perspective tilt. Precisely matching feet, head, limbs between variants for outfit swapping.

CELL 1: front-facing Ryan, fitted plain off-white crew-neck T shirt, silver Cuban link chain, baggy black trousers and clean white sneakers.

CELL 2: IDENTICAL front-facing Ryan and pose, but wearing the photographed black varsity jacket over the same shirt. Black wool body, slightly glossy BLACK LEATHER sleeves, black ribbed waistband/cuffs, snap buttons, cream outlined shield letter G on wearer's left chest (image right), small cream cursive embroidery on wearer's right chest. No red jacket, no invented colors. The collar slightly open showing white shirt and chain.

CELL 3: rear view of cell1, plain off-white T-shirt, same black trousers and white sneakers, back of short hair. No face on back.

CELL 4: rear view of cell2, exact reference black varsity jacket. Large cream outlined collegiate GHETTO across upper back; smaller cursive 'Mantenerse Real' beneath; below large circular gold/cream crest with stylized skyscrapers and palm trees and small arched 'DE CALLE PERO ELEGANTE'. Match reference 2 closely. Black sleeves with leather sheen.

Polished game character rendering, clean smooth silhouette, soft studio light, subtle realistic fabric, NO PIXELS, no wolf or animal features. Fully transparent background, no ground plane, NO shadows outside the figures, no labels, no text beyond clothing lettering, no extra objects or borders. Entire figures from hair to shoes visible, no clipping, ample transparent separation. This is a sprite asset not a scene or webpage.
