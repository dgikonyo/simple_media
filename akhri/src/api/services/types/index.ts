export interface CreateArticleDto {
  title: string
  body: string
  excerpt?: string
  imageUrl?: string
  status: 'draft' | 'published'
  analysisData?: Record<string, any>
  summarisedStory?: string
}

export interface Article extends CreateArticleDto {
  id: string
  title: string
  slug: string
  content: string
  bloggerId: string
  createdAt: string
}

export interface Video {
  id: number
  title: string
  duration: string
  image: string
}

export interface UserEntity {
  id: string
  firstName: string
  lastName: string
  email: string
  dob: Date
  countryId: number
  roleId: number
}

// dto
export interface RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  countryId: number;
  roleId: number;
}

export interface Role {
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  countryName: string;
  countryInitial: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetRoleDto {
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCountryDto {
  countryName: string;
  countryInitial: string;
  createdAt: string;
  updatedAt: string;
}
