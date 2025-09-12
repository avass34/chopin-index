import { groq } from 'next-sanity'

export const getAllPianistsQuery = groq`
  *[_type == "pianist"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    nationality,
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
    nationality,
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
    nickname,
    isPopular,
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
      appleTimestamp,
      title,
      transcript,
      "podcast": podcast->{
        _id,
        "slug": slug.current,
        title,
        description,
        pageLink,
        spotifyUrl,
        youtubeUrl,
        applePodcastUrl
      }
    }
  }
`

export const getWorkBySlugQuery = groq`
  *[_type == "work" && slug.current == $slug][0] {
    _id,
    pieceTitle,
    nickname,
    isPopular,
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
      appleTimestamp,
      title,
      transcript,
      "podcast": podcast->{
        _id,
        title,
        description,
        seasonNumber,
        episodeNumber,
        "imageUrl": image.asset->url,
        pageLink,
        spotifyUrl,
        youtubeUrl,
        applePodcastUrl
      }
    },
    "opus": *[_type == "opus" && references(^._id)][0]{
      _id,
      title,
      "slug": slug.current,
      date,
      "category": category->{
        _id,
        name,
        pluralName,
        "slug": slug.current,
        "imageUrl": image.asset->url,
        imageDescription
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
    youtubeUrl,
    applePodcastUrl,
    pageLink
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
    youtubeUrl,
    applePodcastUrl,
    pageLink
  }
`

export const getWorksByPianistQuery = groq`
  *[_type == "work" && references($pianistId)] | order(yearOfComposition desc) {
    _id,
    "slug": slug.current,
    pieceTitle,
    nickname,
    key,
    isPopular,
    yearOfComposition,
    duration,
    description,
    "opus": *[_type == "opus" && references(^._id)][0]{
      _id,
      title,
      "slug": slug.current,
      date,
      "category": category->{
        _id,
        name,
        pluralName,
        "slug": slug.current,
        "imageUrl": image.asset->url,
        imageDescription
      }
    }
  }
`

export const getWorksByPodcastQuery = groq`
  *[_type == "work" && references($podcastId)] {
    _id,
    "slug": slug.current,
    pieceTitle,
    nickname,
    isPopular,
    yearOfComposition,
    duration,
    description,
    "spotifyTimestamp": podcastHighlights[references($podcastId)][0].spotifyTimestamp,
    "youtubeTimestamp": podcastHighlights[references($podcastId)][0].youtubeTimestamp
  }
`

export const getPopularWorksQuery = groq`
  *[_type == "work" && isPopular == true] | order(yearOfComposition desc) {
    _id,
    "slug": slug.current,
    pieceTitle,
    nickname,
    isPopular,
    yearOfComposition,
    duration,
    description,
    movements,
    key,
    "opus": *[_type == "opus" && references(^._id)][0]{
      _id,
      title,
      date
    }
  }
`

export const getChopinProfileQuery = groq`
  *[_type == "chopinProfile" && _id == "chopin-profile"][0] {
    _id,
    "profileImageUrl": profileImage.asset->url,
    "profileImageAlt": profileImage.alt,
    "backgroundImageUrl": backgroundImage.asset->url,
    "backgroundImageAlt": backgroundImage.alt,
    birthDate,
    deathDate,
    biography,
    extendedBiography
  }
`

export const getAllCategoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    pluralName,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    imageDescription,
    description
  }
`

export const getAllImageGalleryQuery = groq`
  *[_type == "imageGallery"] | order(_createdAt desc) {
    _id,
    title,
    "imageUrl": image.asset->url
  }
`

export const getAllOpusesQuery = groq`
  *[_type == "opus"] | order(date asc) {
    _id,
    title,
    "slug": slug.current,
    date,
    "category": category->{
      _id,
      name,
      pluralName,
      "slug": slug.current,
      "imageUrl": image.asset->url,
      imageDescription
    },
    "works": works[]->{
      _id,
      pieceTitle,
      nickname,
      key,
      "slug": slug.current
    }
  }
`

export const getOpusBySlugQuery = groq`
  *[_type == "opus" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    date,
    "category": opus->category->{
      _id,
      name,
      pluralName,
      "slug": slug.current,
      "imageUrl": image.asset->url,
      imageDescription
    },
    "works": works[]->{
      _id,
      pieceTitle,
      "slug": slug.current,
      yearOfComposition,
      duration,
      description,
      movements
    }
  }
`
