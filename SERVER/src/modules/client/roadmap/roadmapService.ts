import { STATUS_CODE } from "../../../constants/appConstants";
import { CustomError } from "../../../utils";

export const getAllRoadmapsService = async (req: any) => {
  const tenantPrisma = req.tenantPrisma;
  const userId = req.user.userId;

  const roadmaps = await tenantPrisma.lms_roadmap.findMany({
    where: { is_published: true },
    include: {
      lms_user_roadmap_view: {
        where: { user_id: userId },
      },
    },
    orderBy: { created_at: "desc" },
  });

  // const result = roadmaps.map((r: any) => {
  //   const { lms_user_roadmap_view, ...rest } = r;
  //   return {
  //     ...rest,
  //     can_view: lms_user_roadmap_view.length > 0,
  //   };
  // });
  const result = roadmaps.map((r: any) => {
    const { lms_user_roadmap_view, ...rest } = r;
    return {
      ...rest,
      can_view: true,
    };
  });

  return result;
};

export const getRoadmapByIdService = async (req: any, id: number) => {
  const tenantPrisma = req.tenantPrisma;
  const roadmap = await tenantPrisma.lms_roadmap.findUnique({
    where: { id, is_published: true },
    include: {
      lms_roadmap_course_mapping: {
        include: {
          lms_course: true,
        },
        orderBy: {
          order_index: "asc",
        },
      },
    },
  });

  if (!roadmap) {
    throw new CustomError({
      message: "Roadmap not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  return roadmap;
};

export const getRoadmapCoursesService = async (req: any, roadmapId: number) => {
  const tenantPrisma = req.tenantPrisma;
  const userId = req.user.userId;

  // Check if roadmap is published
  const roadmap = await tenantPrisma.lms_roadmap.findUnique({
    where: { id: roadmapId, is_published: true },
  });

  if (!roadmap) {
    throw new CustomError({
      message: "Roadmap not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  const mappings = await tenantPrisma.lms_roadmap_course_mapping.findMany({
    where: { roadmap_id: roadmapId },
    include: {
      lms_course: {
        include: {
          lms_user_course_view: {
            where: { user_id: userId },
          },
        },
      },
    },
    orderBy: { order_index: "asc" },
  });

  // Fetch dependencies for all courses in this roadmap
  const courseIds = mappings.map((m: any) => m.course_id);
  const dependencies = await tenantPrisma.lms_course_dependency.findMany({
    where: { course_id: { in: courseIds } },
  });

  // const result = mappings.map((m: any) => ({
  //   ...m,
  //   can_view: m.lms_course.lms_user_course_view.length > 0,
  //   dependencies: dependencies
  //     .filter((d: any) => d.course_id === m.course_id)
  //     .map((d: any) => d.parent_course_id),
  // }));

   const result = mappings.map((m: any) => ({
    ...m,
    can_view: true,
    dependencies: dependencies
      .filter((d: any) => d.course_id === m.course_id)
      .map((d: any) => d.parent_course_id),
  }));

  return result;
};

export const getCourseModulesService = async (req: any, courseId: number) => {
  const tenantPrisma = req.tenantPrisma;

  const modules = await tenantPrisma.lms_module.findMany({
    where: { 
      course_id: courseId,
      is_published: true
    },
    include: {
      lms_submodule: {
        orderBy: {
          order_index: "asc"
        }
      }
    },
    orderBy: {
      order_index: "asc"
    }
  });

  return modules;
};
