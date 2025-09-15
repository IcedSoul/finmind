package models

type PaginationInfo struct {
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int64 `json:"total_pages"`
}

type PaginatedResponse[T any] struct {
	Items      []T            `json:"items"`
	Pagination PaginationInfo `json:"pagination"`
}

func NewPaginatedResponse[T any](items []T, page, limit int, total int64) PaginatedResponse[T] {
	totalPages := (total + int64(limit) - 1) / int64(limit)
	return PaginatedResponse[T]{
		Items: items,
		Pagination: PaginationInfo{
			Page:       page,
			Limit:      limit,
			Total:      total,
			TotalPages: totalPages,
		},
	}
}