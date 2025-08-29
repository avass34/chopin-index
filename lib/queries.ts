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

export const getAllWorksQuery = groq`
  *[_type == "work"] | order(yearOfComposition desc) {
    _id,
    pieceTitle,
    opusNumber,
    yearOfComposition,
    duration,
    description,
    movements,
    "imageUrl": image.asset->url,
    "notablePerformers": notablePerformers[]->{
      _id,
      name
    },
    "podcastHighlights": podcastHighlights[]->{
      _id,
      title,
      timestamp,
      description
    }
  }
`
