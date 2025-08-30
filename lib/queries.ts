import { groq } from 'next-sanity'

export const getAllPianistsQuery = groq`
  *[_type == "pianist"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
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
    "slug": slug.current,
    dateBorn,
    dateDead,
    biography,
    "imageUrl": image.asset->url
  }
`

export const getAllWorksQuery = groq`
  *[_type == "work"] | order(yearOfComposition desc) {
    _id,
    "slug": slug.current,
    pieceTitle,
    category,
    opusNumber,
    yearOfComposition,
    duration,
    description,
    movements,
    "notablePerformers": notablePerformers[]->{
      _id,
      name,
      "slug": slug.current
    },
    "podcastHighlights": podcastHighlights[]{
      spotifyTimestamp,
      youtubeTimestamp,
      "podcast": podcast->{
        _id,
        "slug": slug.current,
        title,
        description
      }
    }
  }
`

export const getWorkBySlugQuery = groq`
  *[_type == "work" && slug.current == $slug][0] {
    _id,
    pieceTitle,
    category,
    opusNumber,
    yearOfComposition,
    duration,
    description,
    movements,
    key,
    "imslpImageUrl": imslpImage.asset->url,
    imslpLink,
    "notablePerformers": notablePerformers[]->{
      _id,
      name,
      "slug": slug.current
    },
    "podcastHighlights": podcastHighlights[]{
      spotifyTimestamp,
      youtubeTimestamp,
      "podcast": podcast->{
        _id,
        title,
        description,
        seasonNumber,
        episodeNumber,
        "imageUrl": image.asset->url
      }
    }
  }
`

export const getAllPodcastSnippetsQuery = groq`
  *[_type == "podcastSnippet"] | order(seasonNumber asc, episodeNumber asc) {
    _id,
    "slug": slug.current,
    title,
    seasonNumber,
    episodeNumber,
    description,
    duration,
    "imageUrl": image.asset->url,
    spotifyUrl,
    youtubeUrl
  }
`

export const getPodcastSnippetBySlugQuery = groq`
  *[_type == "podcastSnippet" && slug.current == $slug][0] {
    _id,
    title,
    seasonNumber,
    episodeNumber,
    description,
    duration,
    "imageUrl": image.asset->url,
    spotifyUrl,
    youtubeUrl
  }
`

export const getWorksByPianistQuery = groq`
  *[_type == "work" && references($pianistId)] | order(yearOfComposition desc) {
    _id,
    "slug": slug.current,
    pieceTitle,
    category,
    opusNumber,
    yearOfComposition,
    duration,
    description
  }
`
