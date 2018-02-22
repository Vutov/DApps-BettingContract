namespace Admin.AutoMapper
{
    using global::AutoMapper;

    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            //this.CreateMap<DocProduct, Product>()
            //    .ForMember(x => x.ProductID, opts => opts.MapFrom(x => x.ID))
            //    .ForMember(x => x.ID, opts => opts.Ignore());
        }
    }
}
