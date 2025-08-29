import { groq } from 'next-sanity'

export const getAllPianistsQuery = groq`
  *[_type == "pianist"] | order(name asc) {
    _id,
    name,
    dateBorn,
    dateDead,
    biography,
    "imageUrl": image.asset->url
  }
`

export const getPianistBySlugQuery = groq`
  *[_type == "pianist" && slug.current == $slug][0] {
    _id,
    name,
    dateBorn,
    dateDead,
    biography,
    "imageUrl": image.asset->url
  }
`
