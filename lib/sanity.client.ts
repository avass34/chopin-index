import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01', // Use today's date or your preferred version
  useCdn: false, // `false` if you want to ensure fresh data
})

// Helper function to get Chopin Profile
export async function getChopinProfile() {
  return client.fetch(`
    *[_type == "chopinProfile"][0] {
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
  `)
}

// Helper function to get Popular Works
export async function getPopularWorks() {
  return client.fetch(`
    *[_type == "work" && isPopular == true] | order(yearOfComposition desc) {
      _id,
      "slug": slug.current,
      pieceTitle,
      nickname,
      key,
      isPopular,
      yearOfComposition,
      duration,
      description,
      movements
    }
  `)
}
