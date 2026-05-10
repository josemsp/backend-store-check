type SupabaseExecutable<T> = PromiseLike<{
	data: T[] | null;
	error: { message: string } | null;
	count: number | null;
}>;

type PaginationParams = {
	page: number;
	page_size: number;
};

type PaginatedResult<T> = {
	data: T[];
	meta: {
		page: number;
		page_size: number;
		total: number;
		total_pages: number;
	};
};

export async function paginate<T>(
	query: {
		range: (from: number, to: number) => SupabaseExecutable<T>;
	},
	params: PaginationParams,
): Promise<PaginatedResult<T>> {
	const { page, page_size } = params;

	const from = (page - 1) * page_size;
	const to = from + page_size - 1;

	const { data, error, count } = await query.range(from, to);

	if (error) throw new Error(error.message);

	return {
		data: data ?? [],
		meta: {
			page,
			page_size,
			total: count ?? 0,
			total_pages: Math.ceil((count ?? 0) / page_size),
		},
	};
}
