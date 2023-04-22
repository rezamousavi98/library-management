export interface ApiResponse<EntityType> {
    results: EntityType;
    count?: number;
}